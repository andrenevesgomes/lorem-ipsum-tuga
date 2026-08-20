import { ImageResponse } from '@vercel/og';
import { generator } from '../src/utils/generator';
import { decodeShareState } from '../src/utils/urlState';

export const config = { runtime: 'edge' };

// Renders a 1200x630 social-preview card. When the request carries a shared
// generation (?p=..&s=..), it reproduces that exact text and shows a teaser,
// so a link posted on WhatsApp/Twitter/LinkedIn previews the actual chouriço.
export default function handler(req: Request) {
    const { search } = new URL(req.url);
    const state = decodeShareState(search);

    let teaser =
        'Esquece o Latim. Enche os teus layouts com bacalhau, bigodes e muito azeite.';
    if (state) {
        const [paragraph] = generator.generate(1, state.intensity, state.options, state.seed);
        teaser =
            paragraph.length > 220 ? paragraph.slice(0, 220).trimEnd() + '…' : paragraph;
    }

    return new ImageResponse(
        (
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    width: '100%',
                    height: '100%',
                    padding: '64px',
                    background: 'linear-gradient(135deg, #046A38 0%, #035530 100%)',
                    fontFamily: 'sans-serif',
                }}
            >
                {/* Wordmark */}
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div
                        style={{
                            display: 'flex',
                            width: '28px',
                            height: '56px',
                            backgroundColor: '#DA291C',
                            borderRadius: '6px',
                            marginRight: '20px',
                        }}
                    />
                    <div
                        style={{
                            display: 'flex',
                            fontSize: '46px',
                            fontWeight: 800,
                            color: '#FFD700',
                            letterSpacing: '-1px',
                        }}
                    >
                        Lorem Ipsum Tuga
                    </div>
                </div>

                {/* Teaser */}
                <div
                    style={{
                        display: 'flex',
                        borderLeft: '10px solid #FFD700',
                        paddingLeft: '32px',
                        fontSize: teaser.length > 150 ? '44px' : '52px',
                        lineHeight: 1.28,
                        fontWeight: 700,
                        color: '#ffffff',
                    }}
                >
                    {`“${teaser}”`}
                </div>

                {/* Footer */}
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        fontSize: '28px',
                        color: '#FFD700',
                        fontWeight: 600,
                    }}
                >
                    <div style={{ display: 'flex' }}>encher-chouricos.vercel.app</div>
                    <div style={{ display: 'flex' }}>Gerador de texto tuga 🇵🇹</div>
                </div>
            </div>
        ),
        { width: 1200, height: 630 },
    );
}
