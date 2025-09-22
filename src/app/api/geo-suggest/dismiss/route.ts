import { NextResponse } from 'next/server';

export async function POST() {
    const res = NextResponse.json({ ok: true });
    // Clear short-lived suggestion cookies
    res.cookies.set('NEXT_SUGGEST_COUNTRY', '', { path: '/', maxAge: 0 });
    res.cookies.set('NEXT_SUGGEST_LOCALE', '', { path: '/', maxAge: 0 });
    res.cookies.set('NEXT_SUGGEST_PATH', '', { path: '/', maxAge: 0 });
    res.cookies.set('NEXT_SUGGEST_CURRENT_COUNTRY', '', { path: '/', maxAge: 0 });
    res.cookies.set('NEXT_SUGGEST_CURRENT_LOCALE', '', { path: '/', maxAge: 0 });
    return res;
}


