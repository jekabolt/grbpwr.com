/**
 * Dev-only: test catalog param validation.
 * GET /api/dev/validate-catalog?topCategoryIds=abc&subCategoryIds=xyz
 * Returns the parsed filterConditions to verify invalid params are dropped.
 */
import { NextResponse } from "next/server";

import { getProductsPagedQueryParams } from "@/app/[locale]/catalog/_components/utils";

export async function GET(request: Request) {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not available in production" }, { status: 404 });
  }

  const { searchParams } = new URL(request.url);
  const result = getProductsPagedQueryParams(
    {
      gender: searchParams.get("gender") ?? "men",
      topCategoryIds: searchParams.get("topCategoryIds") ?? undefined,
      subCategoryIds: searchParams.get("subCategoryIds") ?? undefined,
      sort: searchParams.get("sort") ?? undefined,
      order: searchParams.get("order") ?? undefined,
    },
    undefined,
  );

  return NextResponse.json({
    input: {
      topCategoryIds: searchParams.get("topCategoryIds"),
      subCategoryIds: searchParams.get("subCategoryIds"),
    },
    output: result.filterConditions,
  });
}
