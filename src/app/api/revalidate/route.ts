import { revalidatePath, revalidateTag } from "next/cache";
import {
  ARCHIVES_CACHE_TAG,
  HERO_CACHE_TAG,
  PRODUCTS_CACHE_TAG,
} from "@/constants";

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
    return Response.json({ error: "Invalid secret" }, { status: 401 });
  }

  if (Array.isArray(data.products) && data.products.length > 0) {
    revalidateTag(PRODUCTS_CACHE_TAG);
    // Product pages are keyed by base SKU in /p/[handle]; the backend revalidation
    // webhook payload (owned outside the proto contract) still sends ids, so we
    // revalidate the product route as a whole — the tag above already refreshes the
    // fetched data. If that payload ever carries base SKUs, this can narrow to the
    // exact /p/{handle}.
    revalidatePath("/[locale]/p/[handle]", "page");
    // Revalidate all catalog pages (dynamic routes)
    revalidatePath("/catalog", "layout");
  }

  if (data.hero === true) {
    revalidateTag(HERO_CACHE_TAG);
    revalidatePath("/");
  }

  if (typeof data.archive === "number") {
    revalidateTag(ARCHIVES_CACHE_TAG);
    // Archive pages are keyed by code in /timeline/[handle]; the webhook sends an
    // id, so revalidate the timeline route as a whole (the tag refreshes data).
    revalidatePath("/[locale]/timeline/[handle]", "page");
  }

  return Response.json({
    revalidated: true,
    now: Date.now(),
  });
}
