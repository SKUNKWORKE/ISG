import type { NextConfig } from "next";
import imageWidths from "./src/data/image-widths.json";

const [thumbnail, ...viewport] = [...imageWidths].sort((a, b) => a - b);

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // A self-contained server in .next/standalone, with only the files it uses.
  // scripts/package-amplify.mjs deploys it; see "Hosting" in the README.
  output: "standalone",
  // The supplier stock lists are read from disk at run time (supplier-stones.ts),
  // not imported, so the tracer is told about them explicitly.
  outputFileTracingIncludes: {
    "/*": ["./src/data/stones/*.json"],
  },
  // Photos are resized before the build (scripts/build-images.mjs), so the
  // server never runs Next's image optimizer and doesn't need sharp's native
  // libraries — about 46 MB of the deployed server.
  outputFileTracingExcludes: {
    "/*": ["node_modules/sharp/**", "node_modules/@img/**"],
  },
  experimental: {
    // Pages rendered on demand (most stone pages) are cached in memory rather
    // than written back into the build folder, which is read-only on
    // serverless hosts such as Amplify.
    isrFlushToDisk: false,
  },
  images: {
    loader: "custom",
    loaderFile: "./src/lib/image-loader.ts",
    // Exactly the widths build-images.mjs produces, so srcset never asks for one that doesn't exist.
    imageSizes: [thumbnail],
    deviceSizes: viewport,
  },
  async headers() {
    return [
      {
        // Frame sequences are content-addressed by index and never mutate in
        // place — a new render means a new folder, so they can cache forever.
        source: "/sequence/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
