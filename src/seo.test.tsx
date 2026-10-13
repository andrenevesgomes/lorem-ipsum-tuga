import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { render } from './entry-server';

const indexHtml = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const prerendered = render();

describe('SEO: what crawlers get', () => {
    it('prerenders a single h1 and a logical heading order', () => {
        const levels = [...prerendered.matchAll(/<h([1-6])\b/g)].map((m) => Number(m[1]));
        expect(levels.filter((l) => l === 1)).toHaveLength(1);
        expect(levels[0]).toBe(1);
        for (let i = 1; i < levels.length; i++) {
            expect(levels[i] - levels[i - 1]).toBeLessThanOrEqual(1);
        }
    });

    it('prerenders the explanatory text, not just the controls', () => {
        expect(prerendered).toContain('Porquê «encher chouriços»?');
        expect(prerendered).toContain('português de Portugal');
        expect(prerendered).toMatch(/<main\b/);
    });

    it('arrives with a generated text instead of an empty box', () => {
        const output = prerendered.match(/<div id="output-text"[^>]*>([\s\S]*?)<\/div>/)?.[1] ?? '';
        expect(output.match(/<p\b/g)).toHaveLength(3);
        expect(prerendered).not.toContain('Ainda não há chouriço nenhum');
    });

    it('has a meta description that fits in a search result', () => {
        const description = indexHtml.match(/<meta name="description" content="([^"]+)"/)?.[1] ?? '';
        expect(description.length).toBeGreaterThanOrEqual(70);
        expect(description.length).toBeLessThanOrEqual(160);
    });

    it('has valid JSON-LD that matches the page', () => {
        const json = indexHtml.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)?.[1] ?? '';
        const data = JSON.parse(json);
        expect(data['@type']).toBe('WebApplication');
        expect(data.url).toBe('https://encher-chouricos.vercel.app/');
        expect(data.offers.price).toBe('0');
    });
});
