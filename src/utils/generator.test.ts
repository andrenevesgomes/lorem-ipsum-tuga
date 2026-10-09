import { describe, it, expect } from 'vitest';
import { TugaGenerator } from './generator';
import { dictionary } from '../data/dictionary';
import { atualidade } from '../data/atualidade';

const gen = new TugaGenerator();
const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const adjectiveForms = dictionary.slangAdjectives.flatMap((a) => a.split('|'));

const ALL_ON = { celebrities: true, expressions: true, food: true };
const ALL_OFF = { celebrities: false, expressions: false, food: false };

/** Run the generator many times so probabilistic bugs surface reliably. */
function collect(intensity: number, options = ALL_ON, runs = 60): string {
    let all = '';
    for (let i = 0; i < runs; i++) {
        all += gen.generate(4, intensity, options).join('\n\n') + '\n\n';
    }
    return all;
}

describe('TugaGenerator', () => {
    it('returns exactly the requested number of paragraphs', () => {
        for (const n of [1, 3, 5, 10]) {
            expect(gen.generate(n, 50, ALL_ON)).toHaveLength(n);
        }
    });

    it('never produces empty paragraphs or "undefined"/"null" leaks', () => {
        const text = collect(50);
        expect(text).not.toMatch(/undefined|null|NaN/);
        for (const p of gen.generate(6, 50, ALL_ON)) {
            expect(p.trim().length).toBeGreaterThan(0);
        }
    });

    it('capitalizes the first letter of every sentence', () => {
        for (const p of gen.generate(6, 80, ALL_ON)) {
            expect(p[0]).toBe(p[0].toUpperCase());
            expect(p[0]).not.toBe(' ');
        }
    });

    it('still generates readable text with every option disabled', () => {
        const text = collect(50, ALL_OFF);
        expect(text.trim().length).toBeGreaterThan(0);
        expect(text).not.toMatch(/undefined|null/);
        // Expressions off => endings are the only source of "!", so none should appear.
        expect(text).not.toContain('!');
    });

    it('excludes celebrities when "Figuras Públicas" is off', () => {
        const text = collect(50, { celebrities: false, expressions: true, food: true });
        for (const name of dictionary.celebrities) {
            expect(text).not.toContain(name.replace(/^(o|a) /, ''));
        }
    });

    it('excludes food expressions when "Comida" is off', () => {
        const text = collect(50, { celebrities: true, expressions: true, food: false });
        for (const phrase of [...dictionary.foodActions, ...dictionary.foodComplements]) {
            expect(text).not.toContain(phrase);
        }
    });

    it('excludes intros and endings when "Expressões Típicas" is off', () => {
        const text = collect(80, { celebrities: true, expressions: false, food: true });
        for (const ending of dictionary.endings) {
            expect(text).not.toContain(ending);
        }
    });

    it('includes food expressions at least sometimes when enabled', () => {
        const text = collect(50, { celebrities: true, expressions: true, food: true });
        const someFoodAppears = dictionary.foodActions.some((p) => text.includes(p));
        expect(someFoodAppears).toBe(true);
    });

    it('is deterministic: the same seed reproduces the exact same text', () => {
        const a = gen.generate(5, 70, ALL_ON, 123456);
        const b = gen.generate(5, 70, ALL_ON, 123456);
        expect(a).toEqual(b);
    });

    it('produces different text for different seeds', () => {
        const a = gen.generate(4, 70, ALL_ON, 1).join('\n');
        const b = gen.generate(4, 70, ALL_ON, 2).join('\n');
        expect(a).not.toEqual(b);
    });

    it('never pairs a real public figure with a cheeky action', () => {
        let text = '';
        for (let seed = 0; seed < 400; seed++) {
            text += gen.generate(5, 100, ALL_ON, seed).join(' ') + ' ';
        }

        const cheeky = dictionary.cheekyActions.map(escape).join('|');
        const between = `(, [^,]+,| (${adjectiveForms.map(escape).join('|')}))?`;
        for (const name of dictionary.celebrities) {
            const pairing = new RegExp(`${escape(name)}${between} (${cheeky})`, 'i');
            expect(text).not.toMatch(pairing);
        }
        // Not vacuous: cheeky actions still happen to everyone else.
        expect(dictionary.cheekyActions.some((a) => text.includes(a))).toBe(true);
    });

    it('makes slang adjectives agree with feminine subjects', () => {
        let text = '';
        for (let seed = 0; seed < 400; seed++) {
            text += gen.generate(5, 100, ALL_ON, seed).join(' ') + ' ';
        }

        const feminine = [...dictionary.people, ...dictionary.celebrities].filter((s) => /^(a|uma) /.test(s));
        const masculineOnly = dictionary.slangAdjectives
            .filter((a) => a.includes('|'))
            .map((a) => a.split('|')[0]);
        for (const subject of feminine) {
            for (const adjective of masculineOnly) {
                expect(text).not.toContain(`${subject} ${adjective} `);
            }
        }
        // Not vacuous: bare adjectives do show up.
        expect(adjectiveForms.some((a) => new RegExp(` ${escape(a)} `).test(text))).toBe(true);
    });

    it('mixes in the current topical jokes', () => {
        let text = '';
        for (let seed = 0; seed < 100; seed++) {
            text += gen.generate(5, 100, ALL_ON, seed).join(' ') + ' ';
        }
        expect(atualidade.actions.some((a) => text.includes(a))).toBe(true);
    });

    it('keeps punctuation and spacing clean', () => {
        let text = '';
        for (let seed = 0; seed < 200; seed++) {
            text += gen.generate(5, 100, ALL_ON, seed).join('\n') + '\n';
        }
        expect(text).not.toMatch(/ {2}| ,|,,|, [.!?]|\? \p{Ll}/u);
    });
});

describe('dictionary', () => {
    const { revistoEm, ...topical } = atualidade;
    const lists = [
        ...Object.entries(dictionary),
        ...Object.entries(topical).map(([k, v]) => [`atualidade.${k}`, v]),
    ] as [string, string[]][];

    it('has no duplicate entries across lists', () => {
        const all = lists.flatMap(([, entries]) => entries);
        expect(all.length).toBe(new Set(all).size);
    });

    it('has no stray whitespace', () => {
        for (const [list, entries] of lists) {
            for (const entry of entries) {
                expect(entry, `${list}: "${entry}"`).toBe(entry.trim());
                expect(entry, `${list}: "${entry}"`).not.toMatch(/ {2}/);
            }
        }
    });

    it('keeps endings and asides in the shape the generator expects', () => {
        for (const ending of [...dictionary.endings, ...atualidade.endings]) expect(ending).toMatch(/^, .+[!?]$/);
        for (const aside of dictionary.slang) expect(aside).not.toMatch(/[,.!?]/);
        for (const adjective of dictionary.slangAdjectives) expect(adjective).toMatch(/^[^,|]+(\|[^,|]+)?$/);
    });

    it('dates the topical list so it gets reviewed', () => {
        expect(revistoEm).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });

    it('keeps the topical list small (the monthly agent must not bloat it)', () => {
        expect(atualidade.intros.length).toBeLessThanOrEqual(6);
        expect(atualidade.actions.length).toBeLessThanOrEqual(15);
        expect(atualidade.complements.length).toBeLessThanOrEqual(8);
        expect(atualidade.endings.length).toBeLessThanOrEqual(6);
    });
});
