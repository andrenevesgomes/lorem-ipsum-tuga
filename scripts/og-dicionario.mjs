// Renders public/og-dicionario.png, the social preview for /dicionario.
// Run `pnpm og:dicionario` after changing it and commit the PNG.
import { createElement as h } from 'react';
import { readFileSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { ImageResponse } from '@vercel/og';

const require = createRequire(import.meta.url);
const inter = (weight) => ({
    name: 'Inter',
    weight,
    style: 'normal',
    data: readFileSync(require.resolve(`@fontsource/inter/files/inter-latin-${weight}-normal.woff`)),
});

const GREEN = '#046A38';
const RED = '#DA291C';
const div = (style, ...children) => h('div', { style: { display: 'flex', ...style } }, ...children);

const card = div(
    {
        flexDirection: 'column',
        justifyContent: 'space-between',
        width: '100%',
        height: '100%',
        padding: '56px 72px',
        background: '#f5f0e6',
        borderTop: `14px solid ${GREEN}`,
        borderBottom: `14px solid ${RED}`,
        fontFamily: 'Inter',
        color: '#1f2937',
        position: 'relative',
    },
    div(
        { flexDirection: 'column' },
        div(
            { alignItems: 'baseline' },
            div({ fontSize: '128px', fontWeight: 900, color: GREEN, letterSpacing: '-3px' }, 'ca·ra·go'),
            div({ fontSize: '40px', fontWeight: 400, color: '#6b7280', marginLeft: '28px' }, '(interj.)'),
        ),
        div(
            { flexDirection: 'column', fontSize: '46px', fontWeight: 600, lineHeight: 1.4, marginTop: '12px' },
            div({}, '1. Espanto.'),
            div({}, '2. Irritação.'),
            div({}, '3. Vírgula, se fores do Porto.'),
        ),
    ),
    div(
        {
            position: 'absolute',
            right: '72px',
            top: '210px',
            transform: 'rotate(-12deg)',
            border: `8px solid ${RED}`,
            borderRadius: '18px',
            padding: '10px 26px',
            color: RED,
            fontSize: '42px',
            fontWeight: 900,
            letterSpacing: '1px',
        },
        'APROVADO PELA AVÓ',
    ),
    div(
        { justifyContent: 'space-between', alignItems: 'baseline' },
        div({ fontSize: '44px', fontWeight: 900, color: RED }, 'Dicionário Tuga 🇵🇹'),
        div({ fontSize: '28px', fontWeight: 600, color: GREEN }, 'encher-chouricos.vercel.app/dicionario'),
    ),
);

const image = new ImageResponse(card, {
    width: 1200,
    height: 630,
    fonts: [inter(400), inter(600), inter(900)],
});
writeFileSync(new URL('../public/og-dicionario.png', import.meta.url), new Uint8Array(await image.arrayBuffer()));
console.log('public/og-dicionario.png');
