// Collects this month's Portuguese headlines for the "atualidade" update.
// Usage: node scripts/atualidade.mjs  -> prints a Markdown list to stdout.
import { pathToFileURL } from 'node:url';

export const FEEDS = [
    'https://observador.pt/feed/',
    'https://feeds.feedburner.com/PublicoRSS',
    'https://www.rtp.pt/noticias/rss',
];

// Headlines about these never become jokes; matched without accents, by prefix.
const SENSITIVE = [
    'mort', 'morre', 'mata', 'homicid', 'assassin', 'violen', 'violac', 'abus', 'crime', 'crimin',
    'condenad', 'prisao', 'preso', 'detid', 'guerra', 'ataque', 'bomb', 'terror', 'incendio',
    'acidente', 'naufrag', 'ferid', 'vitima', 'suicid', 'cancro', 'doenca', 'sarampo', 'genocid',
    'gaza', 'israel', 'ucrania', 'russia', 'tortur', 'burla', 'droga', 'trafico', 'refens', 'cheias',
    'sismo', 'tempestade', 'luto', 'funeral', 'agress', 'esfaque', 'disparo', 'dispara', 'armas',
    'estrangul', 'fuzil', 'execu', 'furacao', 'mental', 'paliativ', 'pena', 'ameac', 'refugiad',
    'putin', 'netanyahu', 'trump', 'hamas', 'ice',
];

const ENTITIES = { amp: '&', quot: '"', apos: "'", lt: '<', gt: '>', nbsp: ' ' };

function decode(text) {
    return text
        .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
        .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
        .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
        .replace(/&(\w+);/g, (m, name) => ENTITIES[name] ?? m);
}

const fold = (text) => text.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase();

export function extractTitles(xml) {
    return [...xml.matchAll(/<item\b[\s\S]*?<\/item>/g)]
        .map(([item]) => item.match(/<title\b[^>]*>([\s\S]*?)<\/title>/)?.[1] ?? '')
        .map(decode);
}

// Headlines are untrusted input for an AI agent: keep plain words only, short, no markup.
export function sanitize(title) {
    return title
        .replace(/<[^>]*>/g, ' ')
        .replace(/[`*_#|<>[\]{}()\\]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
        .slice(0, 140);
}

export function isSensitive(title) {
    const words = fold(title).split(/[^a-z0-9]+/);
    return words.some((word) => SENSITIVE.some((stem) => word.startsWith(stem)));
}

export function pickHeadlines(titles, limit = 40) {
    const seen = new Set();
    const picked = [];
    for (const raw of titles) {
        const title = sanitize(raw);
        const key = fold(title);
        if (title.length < 15 || seen.has(key) || isSensitive(title)) continue;
        seen.add(key);
        picked.push(title);
        if (picked.length === limit) break;
    }
    return picked;
}

async function main() {
    const titles = [];
    for (const feed of FEEDS) {
        try {
            const res = await fetch(feed, { signal: AbortSignal.timeout(20_000) });
            if (res.ok) titles.push(...extractTitles(await res.text()));
        } catch {
            // One feed down shouldn't cancel the month; the others are enough.
        }
    }
    const headlines = pickHeadlines(titles);
    if (headlines.length === 0) throw new Error('Nenhum título recolhido.');
    process.stdout.write(headlines.map((t) => `- ${t}`).join('\n') + '\n');
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
    main().catch((error) => {
        console.error(error.message);
        process.exit(1);
    });
}
