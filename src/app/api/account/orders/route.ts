import { listMyOrdersResponse } from "@/lib/storefront-account/account-orders";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const limitRaw = searchParams.get("limit");
    const offsetRaw = searchParams.get("offset");
    if (limitRaw === null || offsetRaw === null) {
        return NextResponse.json(
            { error: "limit and offset are required" },
            { status: 400 },
        );
    }
    const limit = Number(limitRaw);
    const offset = Number(offsetRaw);
    if (
        !Number.isInteger(limit) ||
        !Number.isInteger(offset) ||
        limit <= 0 ||
        offset < 0
    ) {
        return NextResponse.json(
            { error: "limit must be > 0 and offset must be >= 0" },
            { status: 400 },
        );
    }
    return listMyOrdersResponse(limit, offset);
}