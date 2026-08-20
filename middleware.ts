import { next } from '@vercel/edge';

// Only the app's document route. Shared links look like /?p=..&s=..
export const config = { matcher: '/' };

// For shared links, swap the static OG/Twitter image for a dynamic one that
// previews the actual generated text. Plain visits pass straight through.
export default async function middleware(req: Request): Promise<Response> {
    const url = new URL(req.url);

    // Internal fetch below carries __raw to grab the static HTML without looping.
    if (url.searchParams.has('__raw')) return next();

    // Not a shared generation? Leave the default preview untouched.
    if (!url.searchParams.has('s') || !url.searchParams.has('p')) return next();

    const res = await fetch(`${url.origin}/?__raw=1`, {
        headers: { accept: 'text/html' },
    });
    if (!res.ok) return next();

    const html = await res.text();
    const ogImage = `${url.origin}/api/og?${url.searchParams.toString()}`;
    const rewritten = html
        .split('https://encher-chouricos.vercel.app/og-image.jpeg')
        .join(ogImage);

    return new Response(rewritten, {
        headers: {
            'content-type': 'text/html; charset=utf-8',
            // Cache the rewritten shell at the edge; each seed is its own URL.
            'cache-control': 'public, max-age=0, s-maxage=86400',
        },
    });
}
