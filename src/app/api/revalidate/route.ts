import { ARCHIVES_CACHE_TAG, HERO_CACHE_TAG, PRODUCTS_CACHE_TAG } from "@/constants";
import { revalidatePath, revalidateTag } from "next/cache";

export async function POST(request: Request) {
    const { searchParams } = new URL(request.url);
    const secret = searchParams.get("secret");
    const data = await request.json();

    if (!data || !secret) {
        return Response.json(
            { error: "No body or secret provided" },
            { status: 400 },
        );
    }

    if (secret !== process.env.WEBHOOK_REVALIDATE_SECRET) {
        return Response.json(
            { error: "Invalid secret" },
            { status: 401 },
        );
    }

    console.log("Revalidation request:", JSON.stringify(data));

    if (Array.isArray(data.products) && data.products.length > 0) {
        revalidateTag(PRODUCTS_CACHE_TAG);
        for (const id of data.products) {
            revalidatePath(`/product/${id}`);
        }
    }

    if (data.archive) {
        const { id } = data.archive;
        const path = `/archive/${id}`;
        revalidateTag(ARCHIVES_CACHE_TAG);
        revalidatePath(path);
    }

    if (data.hero && data.hero.changed) {
        revalidateTag(HERO_CACHE_TAG);
        revalidatePath("/");
    }

    return Response.json({
        revalidated: true,
        now: Date.now()
    });
}