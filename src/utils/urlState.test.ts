import { describe, it, expect } from 'vitest';
import { encodeShareState, decodeShareState, randomSeed, ShareState } from './urlState';

const sample: ShareState = {
    paragraphs: 4,
    intensity: 73,
    options: { celebrities: true, expressions: false, food: true },
    seed: 305419896,
};

describe('urlState', () => {
    it('round-trips a share state through encode/decode', () => {
        const decoded = decodeShareState('?' + encodeShareState(sample));
        expect(decoded).toEqual(sample);
    });

    it('returns null when required params are missing', () => {
        expect(decodeShareState('')).toBeNull();
        expect(decodeShareState('?i=50')).toBeNull(); // no p / s
    });

    it('clamps out-of-range values to safe defaults', () => {
        const decoded = decodeShareState('?p=999&i=-5&s=42');
        expect(decoded?.paragraphs).toBe(3); // out of 1..10 -> fallback
        expect(decoded?.intensity).toBe(50); // out of 1..100 -> fallback
        expect(decoded?.seed).toBe(42);
    });

    it('treats only "0" as false for boolean options', () => {
        const decoded = decodeShareState('?p=1&s=1&c=0&e=1&f=0');
        expect(decoded?.options).toEqual({ celebrities: false, expressions: true, food: false });
    });

    it('generates a 32-bit unsigned seed', () => {
        for (let i = 0; i < 100; i++) {
            const s = randomSeed();
            expect(Number.isInteger(s)).toBe(true);
            expect(s).toBeGreaterThanOrEqual(0);
            expect(s).toBeLessThanOrEqual(0xffffffff);
        }
    });
});
