import { GLOBAL_CACHE_TAG, PRODUCT_CACHE_TAG } from "@/constants";
import { revalidatePath, revalidateTag } from "next/cache";

export async function POST(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const secret = searchParams.get("secret");

        if (secret !== process.env.REVALIDATION_SECRET) {
            return Response.json({ error: "Invalid secret" }, { status: 401 });
        }

        let data;
        try {
            data = await request.json();
        } catch (e) {
            return Response.json(
                { error: "Invalid or missing request body" },
                { status: 400 },
            );
        }

        if (!data) {
            return Response.json(
                { error: "No body provided" },
                { status: 400 },
            );
        }

        // Get the provided slug
        const fullSlug = data.full_slug || '';
        console.log("full_slug", fullSlug);

        // Convert to correct path format
        let correctSlug = fullSlug === "home" ? "/" : `/${fullSlug}`;

        // Determine if it's a product and what kind of content we're dealing with
        const isProduct = data.content_type === 'product' || fullSlug.includes('product');
        const isGlobal = data.content_type === 'global' || fullSlug === 'home' || fullSlug.startsWith('components/');

        // For product-specific revalidation
        let productSlug = correctSlug;

        // For debugging
        const paths = [];

        if (isProduct) {
            console.log("Revalidating product cache tag");
            revalidateTag(PRODUCT_CACHE_TAG);

            // Revalidate the /product route itself
            console.log("Revalidating /product path");
            revalidatePath('/product');
            paths.push('/product');

            // If we have product-specific data, try to extract the proper URL
            if (data.product_data) {
                try {
                    const { gender, brand, name, id } = data.product_data;
                    if (gender && brand && name && id) {
                        productSlug = `/product/${gender}/${brand}/${name}/${id}`;
                        console.log("Revalidating specific product path:", productSlug);
                        revalidatePath(productSlug);
                        paths.push(productSlug);
                    }
                } catch (e) {
                    console.log("Could not extract product data", e);
                }
            }
        }

        if (isGlobal) {
            console.log("Revalidating global cache tag");
            revalidateTag(GLOBAL_CACHE_TAG);
        }

        // Always revalidate the given path as well
        console.log("Revalidating original path:", correctSlug);
        revalidatePath(correctSlug);
        paths.push(correctSlug);

        // Handle component changes and redeployment
        if (correctSlug.startsWith("/components/") && process.env.VERCEL_REDEPLOY_HOOK_URL) {
            const response = await fetch(process.env.VERCEL_REDEPLOY_HOOK_URL, {
                method: "POST",
            });

            console.log("trigger redeploy 🧚🏻");
            console.log(response.status, response.statusText);
            console.log(await response.json());
        }

        return Response.json({
            revalidated: true,
            paths,
            isProduct,
            isGlobal,
            now: Date.now()
        });
    } catch (error) {
        console.error("Revalidation error:", error);
        return Response.json({
            revalidated: false,
            message: "Error revalidating",
            error: (error as Error).message
        }, { status: 500 });
    }
} 