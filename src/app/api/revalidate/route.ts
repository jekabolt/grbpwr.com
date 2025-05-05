import { PRODUCT_CACHE_VERSION_TAG } from '@/constants/cacheTags';
import { revalidateTag } from 'next/cache';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        revalidateTag(PRODUCT_CACHE_VERSION_TAG);
        return NextResponse.json({ revalidated: true });
    } catch (err) {
        return NextResponse.json({ error: 'Failed to revalidate', details: String(err) }, { status: 500 });
    }
} 