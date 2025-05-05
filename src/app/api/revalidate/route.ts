
import { GLOBAL_CACHE_TAG, PRODUCT_CACHE_TAG } from "@/constants";
import { revalidatePath, revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        // Get the revalidation secret from the URL
        const searchParams = request.nextUrl.searchParams;
        const secret = searchParams.get("secret");

        // Validate the secret
        if (secret !== process.env.REVALIDATION_SECRET) {
            return NextResponse.json({ message: "Invalid secret" }, { status: 401 });
        }

        // Parse the request body if it exists
        let data;
        let path;

        try {
            data = await request.json();
        } catch (e) {
            // If no JSON body, check for path in query params
            path = searchParams.get("path");
        }

        // Handle both URL param path and body.full_slug formats
        if (data?.full_slug) {
            // Format similar to the given example
            const correctSlug = data.full_slug === "home" ? "/" : `/${data.full_slug}`;
            console.log("Revalidating path from slug:", correctSlug);
            path = correctSlug;
        }

        // If no path provided, just revalidate tags
        if (!path) {
            console.log("No specific path provided. Revalidating all product pages via tag.");

            // Revalidate by tag (affects all pages with this tag)
            revalidateTag(PRODUCT_CACHE_TAG);
            revalidateTag(GLOBAL_CACHE_TAG);

            return NextResponse.json({
                revalidated: true,
                revalidationType: "tag",
                message: "All tagged pages revalidated",
                timestamp: new Date().toISOString()
            });
        }

        // Revalidate the specific path
        console.log("Revalidating path:", path);
        revalidatePath(path);

        // Optional: Trigger a redeploy hook if needed (for component changes)
        const shouldRedeploy = data?.triggerRedeploy === true ||
            path.startsWith("/components/") ||
            searchParams.get("redeploy") === "true";

        if (shouldRedeploy && process.env.VERCEL_REDEPLOY_HOOK_URL) {
            try {
                console.log("Triggering redeploy");
                const response = await fetch(process.env.VERCEL_REDEPLOY_HOOK_URL, {
                    method: "POST",
                });

                console.log("Redeploy status:", response.status, response.statusText);
            } catch (error) {
                console.error("Error triggering redeploy:", error);
            }
        }

        return NextResponse.json({
            revalidated: true,
            path: path,
            message: `Path "${path}" revalidated successfully`,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error("Revalidation error:", error);
        return NextResponse.json({
            revalidated: false,
            message: "Error revalidating",
            error: (error as Error).message
        }, { status: 500 });
    }
} 