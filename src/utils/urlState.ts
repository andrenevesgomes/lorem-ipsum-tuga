import type { GeneratorOptions } from '../data/dictionary.js';

export interface ShareState {
    paragraphs: number;
    intensity: number;
    options: GeneratorOptions;
    seed: number;
}

const clampInt = (value: number, min: number, max: number, fallback: number): number => {
    const n = Math.trunc(value);
    return Number.isFinite(n) && n >= min && n <= max ? n : fallback;
};

/** Serialize a generation into short URL query params (e.g. ?p=3&i=50&c=1&e=1&f=0&s=12345). */
export function encodeShareState(state: ShareState): string {
    const params = new URLSearchParams({
        p: String(state.paragraphs),
        i: String(state.intensity),
        c: state.options.celebrities ? '1' : '0',
        e: state.options.expressions ? '1' : '0',
        f: state.options.food ? '1' : '0',
        s: String(state.seed >>> 0),
    });
    return params.toString();
}

/**
 * Parse a shareable generation from a query string. Returns null when the required
 * fields are missing, so a plain visit (no params) keeps the normal empty state.
 */
export function decodeShareState(search: string): ShareState | null {
    const params = new URLSearchParams(search);
    if (!params.has('p') || !params.has('s')) return null;

    return {
        paragraphs: clampInt(Number(params.get('p')), 1, 10, 3),
        intensity: clampInt(Number(params.get('i')), 1, 100, 50),
        options: {
            celebrities: params.get('c') !== '0',
            expressions: params.get('e') !== '0',
            food: params.get('f') !== '0',
        },
        seed: clampInt(Number(params.get('s')), 0, 0xffffffff, 0),
    };
}

/** A fresh 32-bit seed for a new generation. */
export function randomSeed(): number {
    return Math.floor(Math.random() * 0x100000000) >>> 0;
}

/** Today's date in Portugal (YYYY-MM-DD): "o chouriço de hoje" changes at Lisbon midnight. */
export function lisbonDate(now: Date = new Date()): string {
    return new Intl.DateTimeFormat('en-CA', {
        timeZone: 'Europe/Lisbon',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    }).format(now);
}

/** FNV-1a: everyone gets the same seed on the same day, and nearby days look unrelated. */
export function dailySeed(date: string): number {
    let hash = 0x811c9dc5;
    for (let i = 0; i < date.length; i++) {
        hash ^= date.charCodeAt(i);
        hash = Math.imul(hash, 0x01000193);
    }
    return hash >>> 0;
}

/** The text shown on arrival: default settings, today's seed. */
export function dailyState(now: Date = new Date()): ShareState {
    return {
        paragraphs: 3,
        intensity: 50,
        options: { celebrities: true, expressions: true, food: true },
        seed: dailySeed(lisbonDate(now)),
    };
}
