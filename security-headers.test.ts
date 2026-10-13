import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const read = (file: string) => readFileSync(new URL(file, import.meta.url), 'utf8');
const vercel = JSON.parse(read('./vercel.json')) as {
    headers: { source: string; headers: { key: string; value: string }[] }[];
};
const headerFor = (source: string, key: string) =>
    vercel.headers.find((rule) => rule.source === source)?.headers.find((h) => h.key === key)?.value;

describe('security headers', () => {
    const csp = headerFor('/(.*)', 'Content-Security-Policy') ?? '';

    it.each(['./index.html', './dicionario.html', './public/404.html'])(
        'allows every inline script in %s by hash (update vercel.json when they change)',
        (page) => {
            const inlineScripts = [...read(page).matchAll(/<script>([\s\S]*?)<\/script>/g)];

            for (const [, body] of inlineScripts) {
                const hash = createHash('sha256').update(body).digest('base64');
                expect(csp).toContain(`'sha256-${hash}'`);
            }
        },
    );

    it('finds the inline theme script it is meant to check', () => {
        expect(read('./index.html')).toMatch(/<script>[\s\S]*?<\/script>/);
    });

    it('keeps the policy strict', () => {
        expect(csp).not.toContain('unsafe-inline');
        expect(csp).not.toContain('unsafe-eval');
        expect(csp).toContain("frame-ancestors 'none'");
        expect(csp).toContain("object-src 'none'");
    });

    it('caches hashed build assets for a year', () => {
        expect(headerFor('/assets/(.*)', 'Cache-Control')).toBe('public, max-age=31536000, immutable');
    });
});
