import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { ancora, glossario } from './glossario';

// Everything the visitor can read on the generator: data plus UI copy.
const fontes = [
    './dictionary.ts',
    './atualidade.ts',
    '../App.tsx',
    '../components/Header.tsx',
    '../components/Controls.tsx',
    '../components/OutputBox.tsx',
    '../components/About.tsx',
]
    .map((file) => readFileSync(new URL(file, import.meta.url), 'utf8'))
    .join('\n')
    .toLowerCase();

const entradas = glossario.flatMap((categoria) => categoria.entradas);

describe('Dicionário Tuga', () => {
    it.each(entradas.map((e) => [e.termo, e.procura ?? e.termo]))(
        'explains «%s», which the generator really uses',
        (_termo, procura) => {
            expect(fontes).toContain(procura.toLowerCase());
        },
    );

    it('gives every term and category its own anchor', () => {
        const ids = [...glossario.map((c) => c.id), ...entradas.map((e) => ancora(e.termo))];
        expect(new Set(ids).size).toBe(ids.length);
        for (const id of ids) expect(id).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
    });

    it('turns accents and punctuation into readable anchors', () => {
        expect(ancora('Comó milho')).toBe('como-milho');
        expect(ancora("Emigrante 'avec'")).toBe('emigrante-avec');
        expect(ancora('Leiria (que não existe)')).toBe('leiria-que-nao-existe');
    });

    it('writes full sentences', () => {
        for (const e of entradas) {
            expect(e.definicao).toMatch(/[.!?»]$/);
            expect(e.exemplo).toMatch(/[.!?»]$/);
        }
    });
});
