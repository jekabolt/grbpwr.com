import { NextResponse } from "next/server";
import { GRBPWR_API, GRBPWR_PACK } from "@/brands/grbpwr/config";

import { getShopPack } from "@/lib/shop/server";

// Serves a public, frontend-only view of the backend OpenAPI (Swagger 2.0) spec.
// The upstream document bundles AdminService + AuthService + FrontendService;
// we keep only /api/frontend/* paths and the definitions they transitively
// reference, so admin/auth operations and schemas are not advertised.
// grbpwr pack only (see /.well-known/api-catalog); any other host → 404.

const UPSTREAM = GRBPWR_API.swagger;
const PREFIX = "/api/frontend/";
const REF = "#/definitions/";

// Host-dependent (pack check), so rendered per request; the upstream spec
// stays in the data cache for a day.
export const dynamic = "force-dynamic";
const UPSTREAM_TTL_SECONDS = 86400; // 1 day

function collectRefs(node: any, into: Set<string>): void {
  if (!node || typeof node !== "object") return;
  if (Array.isArray(node)) {
    for (const item of node) collectRefs(item, into);
    return;
  }
  for (const [key, value] of Object.entries(node)) {
    if (key === "$ref" && typeof value === "string" && value.startsWith(REF)) {
      into.add(value.slice(REF.length));
    } else {
      collectRefs(value, into);
    }
  }
}

export async function GET() {
  if ((await getShopPack()) !== GRBPWR_PACK) {
    return new NextResponse("Not Found", { status: 404 });
  }
  const upstream = await fetch(UPSTREAM, {
    next: { revalidate: UPSTREAM_TTL_SECONDS },
  });
  if (!upstream.ok) {
    return NextResponse.json(
      { error: "upstream spec unavailable" },
      { status: 502 },
    );
  }
  const spec: any = await upstream.json();

  const paths: Record<string, unknown> = {};
  for (const [path, item] of Object.entries(spec.paths ?? {})) {
    if (path.startsWith(PREFIX)) paths[path] = item;
  }

  // Transitively walk $refs reachable from the frontend paths.
  const seed = new Set<string>();
  collectRefs(paths, seed);
  const needed = new Set<string>();
  const queue = [...seed];
  while (queue.length) {
    const name = queue.pop()!;
    if (needed.has(name)) continue;
    needed.add(name);
    const childRefs = new Set<string>();
    collectRefs(spec.definitions?.[name], childRefs);
    for (const ref of childRefs) if (!needed.has(ref)) queue.push(ref);
  }

  const definitions: Record<string, unknown> = {};
  for (const name of needed) {
    if (spec.definitions?.[name]) definitions[name] = spec.definitions[name];
  }

  const filtered = {
    ...spec,
    host: new URL(GRBPWR_API.anchor).host,
    schemes: ["https"],
    info: {
      ...spec.info,
      title: GRBPWR_API.title,
      description:
        "Public read API for the grbpwr storefront (products, archives, hero).",
    },
    paths,
    definitions,
    tags: Array.isArray(spec.tags)
      ? spec.tags.filter((t: any) => t?.name === "FrontendService")
      : spec.tags,
  };

  return NextResponse.json(filtered, {
    headers: { "Cache-Control": "public, max-age=86400" },
  });
}
