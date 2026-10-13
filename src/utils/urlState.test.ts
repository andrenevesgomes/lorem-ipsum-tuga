import { describe, it, expect } from 'vitest';
import { encodeShareState, decodeShareState, randomSeed, lisbonDate, dailySeed, dailyState, ShareState } from './urlState';

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

describe('o chouriço de hoje', () => {
    it('changes at Lisbon midnight, not UTC midnight', () => {
        // 23:30 UTC in October is already 00:30 the next day in Lisbon (UTC+1).
        expect(lisbonDate(new Date('2026-10-13T23:30:00Z'))).toBe('2026-10-14');
        // In winter Lisbon is on UTC, so 23:30 UTC is still the same day.
        expect(lisbonDate(new Date('2026-12-13T23:30:00Z'))).toBe('2026-12-13');
    });

    it('gives everyone the same text all day, and a different one tomorrow', () => {
        const morning = dailyState(new Date('2026-10-13T07:00:00Z'));
        const night = dailyState(new Date('2026-10-13T22:00:00Z'));
        const tomorrow = dailyState(new Date('2026-10-14T07:00:00Z'));
        expect(night).toEqual(morning);
        expect(tomorrow.seed).not.toBe(morning.seed);
    });

    it('spreads a month of days over distinct seeds that survive a share link', () => {
        const seeds = new Set<number>();
        for (let day = 1; day <= 31; day++) {
            const seed = dailySeed(`2026-10-${String(day).padStart(2, '0')}`);
            seeds.add(seed);
            const state = { ...dailyState(), seed };
            expect(decodeShareState(`?${encodeShareState(state)}`)).toEqual(state);
        }
        expect(seeds.size).toBe(31);
    });
});
