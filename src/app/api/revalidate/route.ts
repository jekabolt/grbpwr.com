import { PRODUCT_CACHE_TAG } from "@/constants";
import { revalidatePath, revalidateTag } from "next/cache";

export async function POST(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const secret = searchParams.get("secret");
        let data;

        try {
            data = await request.json();
        } catch (e) {
            return Response.json(
                { error: "Invalid or missing request body" },
                { status: 400 },
            );
        }

        if (!data || !secret) {
            return Response.json(
                { error: "No body or secret provided" },
                { status: 400 },
            );
        }

        if (secret !== process.env.REVALIDATION_SECRET) {
            return Response.json({ error: "Invalid secret" }, { status: 401 });
        }

        const correctSlug = data.full_slug === "home" ? "/" : `/${data.full_slug}`;

        console.log("full_slug", data.full_slug);
        console.log("correctSlug", correctSlug);

        // Revalidate product cache tag for all product-related content
        revalidateTag(PRODUCT_CACHE_TAG);

        // Always revalidate the specific path
        revalidatePath(correctSlug);

        if (correctSlug.startsWith("/components/") && process.env.VERCEL_REDEPLOY_HOOK_URL) {
            const response = await fetch(process.env.VERCEL_REDEPLOY_HOOK_URL, {
                method: "POST",
            });

            console.log("trigger redeploy 🧚🏻");
            console.log(response.status, response.statusText);
            console.log(await response.json());
        }

        return Response.json({ revalidated: true, now: Date.now() });
    } catch (error) {
        console.error("Revalidation error:", error);
        return Response.json({
            revalidated: false,
            message: "Error revalidating",
            error: (error as Error).message
        }, { status: 500 });
    }
} 