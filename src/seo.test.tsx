import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { render, renderDicionario } from './entry-server';

const indexHtml = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const dicionarioHtml = readFileSync(new URL('../dicionario.html', import.meta.url), 'utf8');
const prerendered = render();
const dicionario = renderDicionario();

const expectGoodHeadings = (html: string) => {
    const levels = [...html.matchAll(/<h([1-6])\b/g)].map((m) => Number(m[1]));
    expect(levels.filter((l) => l === 1)).toHaveLength(1);
    expect(levels[0]).toBe(1);
    for (let i = 1; i < levels.length; i++) {
        expect(levels[i] - levels[i - 1]).toBeLessThanOrEqual(1);
    }
};

const descriptionOf = (html: string) => html.match(/<meta name="description" content="([^"]+)"/)?.[1] ?? '';

describe('SEO: what crawlers get', () => {
    it('prerenders a single h1 and a logical heading order', () => {
        expectGoodHeadings(prerendered);
    });

    it('prerenders the explanatory text, not just the controls', () => {
        expect(prerendered).toContain('Porquê «encher chouriços»?');
        expect(prerendered).toContain('português de Portugal');
        expect(prerendered).toMatch(/<main\b/);
    });

    it('has a meta description that fits in a search result', () => {
        for (const html of [indexHtml, dicionarioHtml]) {
            const description = descriptionOf(html);
            expect(description.length).toBeGreaterThanOrEqual(70);
            expect(description.length).toBeLessThanOrEqual(160);
        }
    });

    it('has valid JSON-LD that matches the page', () => {
        const json = indexHtml.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)?.[1] ?? '';
        const data = JSON.parse(json);
        expect(data['@type']).toBe('WebApplication');
        expect(data.url).toBe('https://encher-chouricos.vercel.app/');
        expect(data.offers.price).toBe('0');
    });
});

describe('SEO: the dictionary page', () => {
    it('prerenders a single h1 and a logical heading order', () => {
        expectGoodHeadings(dicionario);
    });

    it('has its own canonical URL, linked from the generator and listed in the sitemap', () => {
        expect(dicionarioHtml).toContain('<link rel="canonical" href="https://encher-chouricos.vercel.app/dicionario" />');
        expect(prerendered).toContain('href="/dicionario"');
        expect(readFileSync(new URL('../public/sitemap.xml', import.meta.url), 'utf8')).toContain(
            '<loc>https://encher-chouricos.vercel.app/dicionario</loc>',
        );
    });

    it('has valid JSON-LD with a link to every term', () => {
        const json = dicionario.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)?.[1] ?? '';
        const data = JSON.parse(json);
        expect(data['@type']).toBe('DefinedTermSet');
        expect(data.hasDefinedTerm.length).toBeGreaterThan(30);
        for (const term of data.hasDefinedTerm) {
            const anchor = term.url.split('#')[1];
            expect(dicionario).toContain(`id="${anchor}"`);
        }
    });
});
