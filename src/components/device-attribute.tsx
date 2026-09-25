"use client";

import { useEffect } from "react";
import { deviceTypeFor, useViewportWidth } from "@/hooks/use-device-type";

/**
 * Mirrors useDeviceType() onto `<body data-device>` for CSS that can't call a
 * hook (see the `device-mobile` / `device-tablet` variants in globals.css).
 * The attribute is absent until hydration, so nothing keyed on it applies to
 * the server-rendered page — it renders as desktop, as the hook does.
 */
export function DeviceAttribute() {
  const width = useViewportWidth();
  const hydrated = width !== null;
  const device = deviceTypeFor(width);

  useEffect(() => {
    if (hydrated) document.body.dataset.device = device;
  }, [hydrated, device]);

  useEffect(
    () => () => {
      delete document.body.dataset.device;
    },
    [],
  );

  return null;
}
