import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
    // Get information about the request and environment
    const url = new URL(request.url);
    const headers = Object.fromEntries(request.headers);

    // Try a test fetch with force-cache
    const testUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/your-test-endpoint`;
    const testResponse = await fetch(testUrl, {
        cache: "force-cache",
        next: { tags: ["test-cache"] }
    }).catch(e => ({ ok: false, error: e.message }));

    let testCacheHeader = null;
    if (testResponse instanceof Response) {
        testCacheHeader = testResponse.headers.get('x-vercel-cache');
    }

    // Return diagnostics
    return NextResponse.json({
        environment: {
            VERCEL: process.env.VERCEL,
            NODE_ENV: process.env.NODE_ENV,
            NEXT_PUBLIC_BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL,
        },
        request: {
            url: url.toString(),
            headers: headers,
        },
        testFetch: {
            url: testUrl,
            cacheHeader: testCacheHeader,
            responseOk: testResponse instanceof Response ? testResponse.ok : false,
        },
        vercelCacheInfo: "If x-vercel-cache header shows MISS consistently, check the following:",
        troubleshootingSteps: [
            "1. Verify your project is deployed on Vercel (required for x-vercel-cache)",
            "2. Check that you're not in development mode (caching works in production)",
            "3. Ensure your backend sends proper cache headers",
            "4. Verify that URLs are consistent (query params can cause cache misses)",
            "5. Consider using ISR (Incremental Static Regeneration) for dynamic content"
        ]
    });
} 