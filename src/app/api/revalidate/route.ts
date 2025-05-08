import { CACHE_VERSION_TAG, PRODUCTS_CACHE_TAG } from "@/constants";
import { revalidatePath, revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const secret = searchParams.get("secret");

    if (secret !== process.env.WEBHOOK_REVALIDATE_SECRET) {
        return NextResponse.json({ error: "Invalid or missing secret " + process.env.WEBHOOK_REVALIDATE_SECRET + ' kek' }, { status: 401 });
    }

    const data = await req.json();

    if (!data) {
        return NextResponse.json({ error: "No data provided" }, { status: 400 });
    }

    try {
        let path = "";
        if (data.product) {
            const { gender, brand, name, id } = data.product;
            path = `/product/${gender}/${brand}/${name}/${id}`;
            console.log("Revalidating product path:", path);
            await revalidatePath(path);
        }

        console.log("Revalidating tags:", PRODUCTS_CACHE_TAG, CACHE_VERSION_TAG);
        await revalidateTag(PRODUCTS_CACHE_TAG);
        await revalidateTag(CACHE_VERSION_TAG);

        return NextResponse.json({
            revalidated: true,
            path,
            tags: [PRODUCTS_CACHE_TAG, CACHE_VERSION_TAG],
            now: Date.now()
        });
    } catch (err) {
        console.error("Revalidation error:", err);
        return NextResponse.json({ error: "Failed to revalidate" }, { status: 500 });
    }
}