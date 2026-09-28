#!/usr/bin/env python3
"""
Converts supplier stock workbooks (.xlsx) into src/data/stones/<prefix>.json,
one file per workbook, named after the SKU prefix its rows carry ("SSD228811"
-> ssd.json). src/lib/supplier-stones.ts reads every file in that folder when
the server starts.

The files are a table rather than a list of objects: one row per stone, and
the handful of repeated words (shapes, grades, labs) stored once per file and
referred to by position. That keeps tens of thousands of stones to a few
megabytes — see `encode()` below for the layout.

    pip install openpyxl
    python3 scripts/import-stones.py path/to/SSD_All_Stones.xlsx [more.xlsx ...]

Re-running with a newer workbook replaces that supplier's file outright, so a
stone missing from the new list drops off the site.

Origin follows the grading lab: IGI reports are lab-grown stock, GIA reports
natural. The one exception is a row that says outright the stone was grown —
CVD in a growth or treatment column, HPHT as the growth method, or a lab
comment calling it laboratory-grown or man-made. GIA grades grown diamonds too, and listing one
of those as natural would misdescribe it, so those rows go to lab-grown.

Rows are left out, and counted in the summary, when:
  - the lab is anything but IGI or GIA (uncertified, HRD, GSI…) — no origin
    rule covers them, and the site only speaks for those two labs;
  - the shape, carat, colour, clarity, polish, symmetry, measurements, table
    or depth is missing or unreadable — every catalogue card and filter needs
    them;
  - the clarity is I3, below the FL–I2 range the catalogue carries;
  - the stone is already listed: the same report number and carat as a row
    earlier in this run, or the same full grading (origin, carat, colour,
    clarity, polish, symmetry, measurements, table and depth) as a stone in
    src/lib/real-stones.ts or src/lib/real-natural-stones.ts, which carry no
    report numbers. Stones that merely share a size are different stones.

A blank fluorescence is kept and left out of the record rather than guessed
at; the site shows only the grades a stone actually has.

Report numbers, prices, stock location and media links are not copied: the
site shares reports on enquiry and never shows a price. The workbook's own
SKU is the stone's SKU, so the trade desk can look any enquiry up in it.
"""
import json
import re
import sys
from collections import Counter
from pathlib import Path

try:
    import openpyxl
except ImportError:
    sys.exit("openpyxl is required: pip install openpyxl")

ROOT = Path(__file__).resolve().parent.parent
OUT_DIR = ROOT / "src" / "data" / "stones"
EXISTING_TS = [ROOT / "src/lib/real-stones.ts", ROOT / "src/lib/real-natural-stones.ts"]

# Column names per field. Suppliers label the same thing differently; the first
# name a sheet's header contains wins.
COLUMNS = {
    "sku": ["SKU", "Stock Id"],
    "lab": ["Lab", "LAB"],
    "shape": ["Shape", "SHAPE"],
    "carat": ["Carat", "Weight", "SIZE"],
    "color": ["Color", "COLOR"],
    "clarity": ["Clarity", "CLARITY"],
    "cut": ["Cut", "CUT"],
    "polish": ["Polish", "Pol", "POLISH"],
    "symmetry": ["Symmetry", "Sym", "SYMMETRY"],
    "fluorescence": ["Fluorescence", "Fluorescence Intensity", "Flo", "FL"],
    "measurements": ["Measurement", "Measurements", "MEASUREMENTS"],
    "table": ["Table %", "Table"],
    "depth": ["Depth %", "Depth"],
    "report": ["Cert No", "Report #", "Certificate No", "CERTIFICATE #"],
}
# Free-text columns that can say how a stone was made.
ORIGIN_HINTS = ["Growth", "Treatment", "treatment", "Lab Comment", "Comment"]
GROWTH = "Growth"
REQUIRED = ["sku", "lab", "shape", "carat", "color", "clarity", "polish", "symmetry"]

# Supplier cut name -> (shape slug, name shown on the site). Slugs follow the
# conventions in real-stones.ts: square step cuts file under asscher, the
# baguette under emerald (the nearest rectangular step cut), triangles under
# trillion and other polygons under hexagon.
SHAPES = {
    "ROUND": ("round", "Round"),
    "ROUND BRILLIANT": ("round", "Round Brilliant"),
    "OVAL": ("oval", "Oval"),
    "OVAL BRILLIANT": ("oval", "Oval Brilliant"),
    "OVAL MODIFIED BRILLIANT": ("oval", "Oval Modified Brilliant"),
    "PEAR": ("pear", "Pear"),
    "PEAR BRILLIANT": ("pear", "Pear Brilliant"),
    "PEAR MODIFIED BRILLIANT": ("pear", "Pear Modified Brilliant"),
    "EMERALD": ("emerald", "Emerald"),
    "EMERALD CUT": ("emerald", "Emerald Cut"),
    "BAGUETTE": ("emerald", "Baguette"),
    "ASSCHER": ("asscher", "Asscher"),
    "SQUARE EMERALD CUT": ("asscher", "Square Emerald Cut"),
    "SQ EMERALD": ("asscher", "Square Emerald"),
    "RADIANT": ("radiant", "Radiant"),
    "SQ RADIANT": ("radiant", "Square Radiant"),
    "SQ. RADIANT": ("radiant", "Square Radiant"),
    "SQUARE RADIANT": ("radiant", "Square Radiant"),
    "CUT CORNERED RECTANGULAR MODIFIED BRILLIANT": ("radiant", "Cut-Cornered Rectangular Modified Brilliant"),
    "CUSHION": ("cushion", "Cushion"),
    "CUSHION BRILLIANT": ("cushion", "Cushion Brilliant"),
    "CUSHION MODIFIED BRILLIANT": ("cushion", "Cushion Modified Brilliant"),
    "CUSHION MIXED CUT": ("cushion", "Cushion Mixed Cut"),
    "SQUARE CUSHION": ("cushion", "Square Cushion"),
    "SQ CUSHION": ("cushion", "Square Cushion"),
    "SQ. CUSHION": ("cushion", "Square Cushion"),
    "SQUARE CUSHION BRILLIANT": ("cushion", "Square Cushion Brilliant"),
    "SQUARE CUSHION MODIFIED BRILLIANT": ("cushion", "Square Cushion Modified Brilliant"),
    "L.CU": ("cushion", "Long Cushion"),
    "PRINCESS": ("princess", "Princess"),
    "PRINCESS CUT": ("princess", "Princess Cut"),
    "MARQUISE": ("marquise", "Marquise"),
    "MARQUISE BRILLIANT": ("marquise", "Marquise Brilliant"),
    "HEART": ("heart", "Heart"),
    "HEART BRILLIANT": ("heart", "Heart Brilliant"),
    "HEART MODIFIED BRILLIANT": ("heart", "Heart Modified Brilliant"),
    "TRILLIANT": ("trillion", "Trilliant"),
    "TRIANGLE": ("trillion", "Triangle"),
    "HEXAGONAL": ("hexagon", "Hexagonal"),
    "PENTAGON": ("hexagon", "Pentagon"),
}
SHAPE_CODE = {
    "round": "RD", "princess": "PR", "cushion": "CU", "emerald": "EM", "oval": "OV", "pear": "PS",
    "marquise": "MQ", "radiant": "RA", "asscher": "AS", "heart": "HT", "trillion": "TR", "hexagon": "HX",
}
FINISH = {
    "EX": "Excellent", "EXCELLENT": "Excellent", "3EX": "Excellent",
    "VG": "Very Good", "VERY GOOD": "Very Good",
    "G": "Good", "GD": "Good", "GOOD": "Good",
    "F": "Fair", "FR": "Fair", "FAIR": "Fair",
    "ID": "Ideal", "IDEAL": "Ideal",
}
FLUORESCENCE = {
    "NONE": "None", "NON": "None", "N": "None", "NIL": "None",
    "FNT": "Faint", "FAINT": "Faint",
    "VSL": "Very Slight", "VSLT": "Very Slight", "VERY SLIGHT": "Very Slight",
    "SLT": "Slight", "SLIGHT": "Slight",
    "MED": "Medium", "MEDIUM": "Medium",
    "STG": "Strong", "STRONG": "Strong",
    "VST": "Very Strong", "VSTG": "Very Strong", "VERY STRONG": "Very Strong",
}
CLARITY = ["FL", "IF", "VVS1", "VVS2", "VS1", "VS2", "SI1", "SI2", "I1", "I2"]
LETTER_GRADES = set("DEFGHIJKLMNOPQRSTUVWXYZ")
# Initials some suppliers use for a fancy grade.
FANCY_INITIALS = {"F L P": "Fancy Light Pink", "F I P": "Fancy Intense Pink"}
GROWN = re.compile(r"\b(CVD|laboratory[- ]grown|lab[- ]grown|man[- ]made)\b", re.I)


def text(value):
    return re.sub(r"\s+", " ", str(value)).strip() if value is not None else ""


def number(value):
    try:
        n = float(text(value))
    except ValueError:
        return None
    return n if n > 0 else None


def tidy(n):
    """58.0 -> 58, 61.2 -> 61.2: the numbers read as they do on a report."""
    return int(n) if n == int(n) else round(n, 2)


def colour(value):
    raw = text(value)
    if raw.upper() in LETTER_GRADES:
        return raw.upper()
    if raw in FANCY_INITIALS:
        return FANCY_INITIALS[raw]
    raw = re.sub(r"^fency\b", "Fancy", raw, flags=re.I)
    # Fancy grades, and the paler "Light Yellow"-style grades below them.
    if re.match(r"^(fancy|light|very light|faint)\b", raw, re.I):
        return " ".join(word.capitalize() for word in raw.split(" "))
    return None


def header_index(header):
    names = [text(h) for h in header]
    index = {}
    for field, options in COLUMNS.items():
        for option in options:
            if option in names:
                index[field] = names.index(option)
                break
    hints = [(names.index(h), h == GROWTH) for h in ORIGIN_HINTS if h in names]
    return index, hints


def convert(row, index, hints):
    """One sheet row -> (stone dict, None) or (None, reason it was left out).

    The report number rides along as "_report" for duplicate checks and is
    dropped before the stone is written."""
    get = lambda field: row[index[field]] if field in index and index[field] < len(row) else None

    lab = text(get("lab")).upper()
    if lab not in ("IGI", "GIA"):
        return None, f"lab {lab or 'blank'}"
    # HPHT counts only as a growth method: in a treatment column it can mean a
    # natural stone whose colour was improved after mining.
    grown = any(
        GROWN.search(text(row[i])) or (is_growth and "HPHT" in text(row[i]).upper())
        for i, is_growth in hints
        if i < len(row)
    )
    origin = "lab" if lab == "IGI" or grown else "natural"

    shape = SHAPES.get(text(get("shape")).upper())
    carat = number(get("carat"))
    color = colour(get("color"))
    clarity = text(get("clarity")).replace(" ", "").upper()
    polish = FINISH.get(text(get("polish")).upper())
    symmetry = FINISH.get(text(get("symmetry")).upper())
    fluor_raw = text(get("fluorescence")).upper()
    fluorescence = FLUORESCENCE.get(fluor_raw)
    mm = re.findall(r"\d+(?:\.\d+)?", text(get("measurements")))
    table = number(get("table"))
    depth = number(get("depth"))

    if clarity == "I3":
        return None, "clarity I3"
    missing = [
        name
        for name, ok in [
            ("shape", shape), ("carat", carat), ("colour", color), ("clarity", clarity in CLARITY),
            ("polish", polish not in (None, "Ideal")), ("symmetry", symmetry not in (None, "Ideal")),
            ("measurements", len(mm) == 3 and all(float(m) > 0 for m in mm)),
            ("table", table), ("depth", depth),
        ]
        if not ok
    ]
    if fluor_raw and not fluorescence:
        missing.append("fluorescence")
    if missing:
        return None, "missing or unreadable " + ", ".join(missing)

    stone = {
        "sku": text(get("sku")),
        "shape": shape[0],
        "shapeName": shape[1],
        "shapeCode": SHAPE_CODE[shape[0]],
        "origin": origin,
        "carat": round(carat, 2),
        "color": color,
        "clarity": clarity,
    }
    # Labs grade cut on round brilliants only; anything else in the column is
    # the supplier's own call, not the report's.
    cut = FINISH.get(text(get("cut")).upper()) if shape[0] == "round" else None
    if cut:
        stone["cut"] = cut
    stone["polish"] = polish
    stone["symmetry"] = symmetry
    if fluorescence:
        stone["fluorescence"] = fluorescence
    stone["lab"] = lab
    stone["measurements"] = f"{mm[0]} x {mm[1]} x {mm[2]} mm"
    stone["tablePercent"] = tidy(table)
    stone["depthPercent"] = tidy(depth)
    stone["featured"] = False
    report = re.sub(r"\D", "", text(get("report")))
    stone["_report"] = f"{lab}:{report}" if report else None
    return stone, None


# Fields in row order. Those in DICTIONARY_FIELDS are stored as an index into
# the file's `values` list for that field (-1 for "not stated"); the rest are
# stored as they are. shapeCode and featured are not stored: the site derives
# the first from the shape and sets the second itself.
FIELDS = [
    "sku", "shape", "shapeName", "origin", "carat", "color", "clarity", "cut", "polish",
    "symmetry", "fluorescence", "lab", "measurements", "tablePercent", "depthPercent",
]
DICTIONARY_FIELDS = [
    "shape", "shapeName", "origin", "color", "clarity", "cut", "polish", "symmetry", "fluorescence", "lab",
]


def encode(stones):
    """Stones -> the table written to src/data/stones/<prefix>.json."""
    values = {f: sorted({s[f] for s in stones if s.get(f) is not None}) for f in DICTIONARY_FIELDS}
    position = {f: {v: i for i, v in enumerate(vs)} for f, vs in values.items()}

    def cell(stone, field):
        value = stone.get(field)
        if field in position:
            return position[field][value] if value is not None else -1
        if field == "measurements":
            return value.removesuffix(" mm")
        return value

    dump = lambda value: json.dumps(value, ensure_ascii=False, separators=(",", ":"))
    # One stone per line: small diffs when a supplier's list changes.
    rows = ",\n".join(dump([cell(s, f) for f in FIELDS]) for s in stones)
    return f'{{"format":1,"fields":{dump(FIELDS)},"values":{dump(values)},"rows":[\n{rows}\n]}}\n'


def grading_key(stone):
    dims = tuple(float(n) for n in re.findall(r"\d+(?:\.\d+)?", stone["measurements"]))
    return (
        stone["origin"], round(float(stone["carat"]), 2), stone["color"], stone["clarity"],
        stone["polish"], stone["symmetry"], dims, float(stone["tablePercent"]), float(stone["depthPercent"]),
    )


def existing_keys():
    """Grading keys of the stones in the hand-kept TypeScript lists."""
    keys = set()
    for path in EXISTING_TS:
        for block in re.findall(r"\{\s*sku: [\s\S]*?\n  \}", path.read_text()):
            fields = dict(re.findall(r'(\w+): "?([^",\n]+)"?,', block))
            keys.add(grading_key(fields))
    return keys


def read_workbook(path):
    wb = openpyxl.load_workbook(path, read_only=True, data_only=True)
    rows, seen = [], set()
    for ws in wb.worksheets:
        it = ws.iter_rows(values_only=True)
        header = next(it, None)
        if not header:
            continue
        index, hints = header_index(header)
        if not all(field in index for field in REQUIRED):
            continue  # a summary or SKU-map tab
        for row in it:
            sku = text(row[index["sku"]]) if index["sku"] < len(row) else ""
            # Some workbooks repeat every stone on an "All Stones" tab.
            if not sku or sku in seen:
                continue
            seen.add(sku)
            rows.append((row, index, hints))
    return rows


def main(paths):
    if not paths:
        sys.exit(__doc__)
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    listed = existing_keys()
    print(f"{len(listed)} stones already in the TypeScript lists")
    reports = {}  # report number -> carat
    outputs = []
    for path in map(Path, paths):
        stones, skipped = [], Counter()
        for row, index, hints in read_workbook(path):
            stone, reason = convert(row, index, hints)
            if reason:
                skipped[reason] += 1
                continue
            report = stone.pop("_report")
            # A shared report number with a different carat is a typo in one
            # of the two rows, not one stone, so both stay.
            if (report and reports.get(report) == stone["carat"]) or grading_key(stone) in listed:
                skipped["already listed"] += 1
                continue
            if report:
                reports[report] = stone["carat"]
            stones.append(stone)
        if not stones:
            print(f"{path.name}: no stones kept", {**skipped})
            continue
        prefixes = Counter(re.match(r"[A-Za-z]*", s["sku"]).group(0).lower() for s in stones)
        prefix = prefixes.most_common(1)[0][0] or path.stem.lower()
        outputs.append((path, prefix, stones, skipped))

    for path, prefix, stones, skipped in outputs:
        out = OUT_DIR / f"{prefix}.json"
        out.write_text(encode(stones))
        by_origin = Counter(s["origin"] for s in stones)
        print(f"{path.name} -> {out.relative_to(ROOT)}: {by_origin['lab']} lab-grown, {by_origin['natural']} natural")
        for reason, n in sorted(skipped.items(), key=lambda kv: -kv[1]):
            print(f"    left out {n:>6}  {reason}")


if __name__ == "__main__":
    main(sys.argv[1:])
