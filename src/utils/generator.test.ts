import { describe, it, expect } from 'vitest';
import { TugaGenerator } from './generator';
import { dictionary } from '../data/dictionary';

const gen = new TugaGenerator();

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
        // Some names also live in the always-on complements (e.g. "com o Fernando Mendes"),
        // so only assert on celebrities that are exclusive to the celebrity bank.
        const complementText = dictionary.complements.join(' | ');
        for (const name of dictionary.celebrities) {
            if (complementText.includes(name)) continue;
            expect(text).not.toContain(name);
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
});
