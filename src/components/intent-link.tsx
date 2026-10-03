"use client";

import NextLink from "next/link";
import { useState, type ComponentProps } from "react";

type Props = ComponentProps<typeof NextLink>;

/**
 * `next/link`, prefetching on intent rather than on sight.
 *
 * Next.js prefetches every static route a link points at as soon as the link
 * scrolls into view. Here that meant every page load fetched the twenty-odd
 * pages in the header and footer, and every catalogue card scrolled past
 * rendered that stone's page on the server — a function invocation and a
 * cache write per card, for pages almost nobody opened. This waits until the
 * pointer rests on the link, it gets keyboard focus, or a finger touches it,
 * which still lands the prefetch a beat ahead of the click.
 *
 * Every site link imports this instead of `next/link`; it takes the same
 * props. `prefetch={false}` still turns prefetching off entirely, and any other
 * value applies once intent is shown.
 */
export default function Link({ prefetch, onMouseEnter, onTouchStart, onFocus, ...rest }: Props) {
  const [intent, setIntent] = useState(false);

  return (
    <NextLink
      {...rest}
      // `null` is Next's default behaviour, restored once the visitor shows interest.
      prefetch={prefetch === false || !intent ? false : (prefetch ?? null)}
      onMouseEnter={(event) => {
        setIntent(true);
        onMouseEnter?.(event);
      }}
      onTouchStart={(event) => {
        setIntent(true);
        onTouchStart?.(event);
      }}
      onFocus={(event) => {
        setIntent(true);
        onFocus?.(event);
      }}
    />
  );
}
