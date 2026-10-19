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

    it('arrives with a generated text instead of an empty box', () => {
        const output = prerendered.match(/<div id="output-text"[^>]*>([\s\S]*?)<\/div>/)?.[1] ?? '';
        expect(output.match(/<p\b/g)).toHaveLength(3);
        expect(prerendered).not.toContain('Ainda não há chouriço nenhum');
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

    it('has its own 1200x630 preview image for shared links', () => {
        const image = dicionarioHtml.match(/<meta property="og:image" content="https:\/\/encher-chouricos\.vercel\.app\/([^"]+)"/)?.[1];
        expect(image).toBe('og-dicionario.png');
        expect(dicionarioHtml).toContain(`<meta name="twitter:image" content="https://encher-chouricos.vercel.app/${image}" />`);

        const png = readFileSync(new URL(`../public/${image}`, import.meta.url));
        expect([...png.subarray(1, 4)].map((c) => String.fromCharCode(c)).join('')).toBe('PNG');
        expect([png.readUInt32BE(16), png.readUInt32BE(20)]).toEqual([1200, 630]);
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

    it('links both pages to the expression suggestion form, which exists', () => {
        const form = 'sugerir-expressao.yml';
        expect(readFileSync(new URL(`../.github/ISSUE_TEMPLATE/${form}`, import.meta.url), 'utf8')).toContain('name: ');
        for (const html of [prerendered, dicionario]) {
            expect(html).toContain(`/issues/new?template=${form}`);
        }
    });
});

describe('404 page', () => {
    const notFound = readFileSync(new URL('../404.html', import.meta.url), 'utf8');

    it('stays out of search results and still makes sense without JavaScript', () => {
        expect(notFound).toContain('<meta name="robots" content="noindex" />');
        expect(notFound).toMatch(/<h1[^>]*>\s*Esta página não existe\.\s*<\/h1>/);
        expect(notFound).toMatch(/<p id="antes"[^>]*>[\s\S]*?\S[\s\S]*?<\/p>/);
        expect(notFound).toMatch(/<p id="agora"[^>]*>[\s\S]*?\S[\s\S]*?<\/p>/);
        expect(notFound).toContain('src="/ze-povinho-1875.png"');
        expect(notFound).toContain('Rafael Bordalo Pinheiro');
        expect(notFound).toContain('href="/"');

        const ze = readFileSync(new URL('../public/ze-povinho-1875.png', import.meta.url));
        expect([...ze.subarray(1, 4)].map((c) => String.fromCharCode(c)).join('')).toBe('PNG');
    });

    it('has no inline styles (the CSP would block them)', () => {
        expect(notFound).not.toMatch(/\sstyle=|<style/);
    });
});
