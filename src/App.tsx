import { useState, useEffect, useRef } from 'react';
import { Header } from './components/Header';
import { Controls } from './components/Controls';
import { OutputBox } from './components/OutputBox';
import { Toast } from './components/Toast';
import { Flag } from './components/Flag';
import { About } from './components/About';
import { generator } from './utils/generator';
import { encodeShareState, decodeShareState, randomSeed, dailyState, ShareState } from './utils/urlState';
import { Copy, Check, Dice5 } from 'lucide-react';

const COPY_MESSAGE = 'Já está no bucho! (Copiado)';
const LINK_MESSAGE = 'Link copiado! Agora é só espalhar.';
const COPY_BLOCKED_MESSAGE = 'O browser não deixou copiar. Está selecionado, copia à mão.';
const LINK_BLOCKED_MESSAGE = 'Não deu para copiar. O link está na barra de endereço.';
const AZEITE_MAX_MESSAGE = 'Cuidado: a partir daqui o ecrã começa a pingar azeite. 🫒';
const QUASE_LATIM_MESSAGE = 'Sem figuras, sem expressões e sem comida? Isso é quase latim, ó campeão.';
const SIUUU_MESSAGE = 'SIMMMMMM! 🐐🇵🇹 Azeite no máximo!';
const LUSIADAS_MESSAGE = '«As armas e os barões assinalados que da praia ocidental foram beber uma jola…» — Camões (provavelmente)';

function App() {
    const [darkMode, setDarkMode] = useState(
        () => typeof document === 'undefined' || document.documentElement.classList.contains('dark'),
    );
    // Arrive with text already on screen: a shared link's text, or else today's.
    const [initial] = useState<ShareState>(
        () => (typeof window !== 'undefined' && decodeShareState(window.location.search)) || dailyState(),
    );
    const [paragraphs, setParagraphs] = useState(initial.paragraphs);
    const [intensity, setIntensity] = useState(initial.intensity);
    const [options, setOptions] = useState(initial.options);
    const [outputText, setOutputText] = useState<string[]>(
        () => generator.generate(initial.paragraphs, initial.intensity, initial.options, initial.seed),
    );
    const [lastGen, setLastGen] = useState<ShareState | null>(initial);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState(COPY_MESSAGE);
    const [toastKey, setToastKey] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);
    const [justCopied, setJustCopied] = useState(false);
    const flagClicks = useRef(0);

    const notify = (msg: string) => {
        setToastMessage(msg);
        setToastKey((k) => k + 1);
        setShowToast(true);
    };

    // Dark Mode Effect
    useEffect(() => {
        document.documentElement.classList.toggle('dark', darkMode);
    }, [darkMode]);

    const toggleDarkMode = () => {
        const next = !darkMode;
        setDarkMode(next);
        try {
            localStorage.setItem('tuga-theme', next ? 'dark' : 'light');
        } catch {
            // Storage blocked (private mode): the toggle still works for this visit.
        }
    };

    // Generate deterministically from a full state and reflect it in the URL, so the
    // link in the address bar always reproduces exactly what's on screen.
    const runGeneration = (state: ShareState) => {
        setIsAnimating(true);
        setTimeout(() => setIsAnimating(false), 600);

        setLastGen(state);
        setOutputText(generator.generate(state.paragraphs, state.intensity, state.options, state.seed));
        window.history.replaceState(null, '', `${window.location.pathname}?${encodeShareState(state)}`);
    };

    const handleIntensityChange = (val: number) => {
        if (val === 100 && intensity !== 100) {
            notify(AZEITE_MAX_MESSAGE);
        }
        setIntensity(val);
    };

    const handleFlagClick = () => {
        flagClicks.current += 1;
        if (flagClicks.current === 5) {
            flagClicks.current = 0;
            notify(LUSIADAS_MESSAGE);
        }
    };

    const handleGenerate = () => {
        if (!options.celebrities && !options.expressions && !options.food) {
            notify(QUASE_LATIM_MESSAGE);
        }
        runGeneration({ paragraphs, intensity, options, seed: randomSeed() });
    };

    // Secret keyboard trigger: typing "siuuu" or "cr7" anywhere fires maximum azeite.
    useEffect(() => {
        let buffer = '';
        const onKey = (e: KeyboardEvent) => {
            if (e.ctrlKey || e.metaKey || e.altKey || e.key.length !== 1) return;
            buffer = (buffer + e.key.toLowerCase()).slice(-8);
            if (buffer.endsWith('siuuu') || buffer.endsWith('cr7')) {
                buffer = '';
                const allOn = { celebrities: true, expressions: true, food: true };
                setIntensity(100);
                setOptions(allOn);
                notify(SIUUU_MESSAGE);
                runGeneration({ paragraphs, intensity: 100, options: allOn, seed: randomSeed() });
            }
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    });

    const handleSurprise = () => {
        // Roll the dice once, then generate from the exact same values we show in the
        // controls — so what you see is what you got.
        const p = Math.floor(Math.random() * 5) + 1;
        const i = Math.floor(Math.random() * 100) + 1;
        const newOptions = {
            celebrities: Math.random() > 0.5,
            expressions: Math.random() > 0.5,
            food: Math.random() > 0.5,
        };

        setParagraphs(p);
        setIntensity(i);
        setOptions(newOptions);
        runGeneration({ paragraphs: p, intensity: i, options: newOptions, seed: randomSeed() });
    };

    const handleCopy = async () => {
        if (outputText.length === 0) return;

        const payload = outputText.join('\n\n');
        try {
            if (navigator.clipboard?.writeText) {
                await navigator.clipboard.writeText(payload);
            } else {
                throw new Error('Clipboard API unavailable');
            }
            notify(COPY_MESSAGE);
            setJustCopied(true);
            setTimeout(() => setJustCopied(false), 1200);
        } catch {
            // Browser blocked the clipboard (e.g. insecure context): fall back to selection.
            const range = document.createRange();
            const output = document.getElementById('output-text');
            if (output) {
                range.selectNodeContents(output);
                const selection = window.getSelection();
                selection?.removeAllRanges();
                selection?.addRange(range);
            }
            notify(COPY_BLOCKED_MESSAGE);
        }
    };

    const handleShare = async () => {
        if (!lastGen) return;

        const shareUrl = `${window.location.origin}${window.location.pathname}?${encodeShareState(lastGen)}`;
        const shareData = {
            title: 'Lorem Ipsum Tuga',
            text: 'Olha o chouriço que me saiu no Lorem Ipsum Tuga:',
            url: shareUrl,
        };

        if (navigator.share) {
            try {
                await navigator.share(shareData);
            } catch {
                // User dismissed the share sheet — nothing to do.
            }
            return;
        }

        // No Web Share API (typical on desktop): copy the link instead.
        try {
            await navigator.clipboard.writeText(shareUrl);
            notify(LINK_MESSAGE);
        } catch {
            notify(LINK_BLOCKED_MESSAGE);
        }
    };

    return (
        <main className="min-h-screen flex flex-col items-center justify-center gap-12 p-4 md:p-8">
            <div className="w-full max-w-3xl bg-white dark:bg-gray-900 rounded-3xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] dark:shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)] p-6 md:p-12 border-t-8 border-t-tuga-green border-b-8 border-b-tuga-red relative overflow-hidden transition-colors duration-300">
                
                {/* Decorative Flag Strip */}
                <Flag className="absolute top-4 right-4 w-12 h-8 opacity-20 rotate-12 select-none pointer-events-none" />

                <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} onFlagClick={handleFlagClick} />

                <Controls 
                    paragraphs={paragraphs} 
                    setParagraphs={setParagraphs}
                    intensity={intensity}
                    setIntensity={handleIntensityChange}
                    options={options}
                    setOptions={setOptions}
                />

                {/* Action Buttons */}
                <div className="flex flex-wrap justify-center gap-4 mb-10">
                    <button 
                        onClick={handleGenerate}
                        className={`
                            group relative px-8 py-4 rounded-full font-black text-xl uppercase tracking-wide
                            bg-linear-to-br/srgb from-tuga-red to-red-700 text-tuga-gold border-2 border-tuga-gold
                            shadow-[0_6px_0_#7f1d1d] active:shadow-[0_2px_0_#7f1d1d] active:translate-y-1
                            transition-all hover:-translate-y-1 hover:shadow-[0_10px_0_#7f1d1d]
                            flex items-center gap-3
                            ${isAnimating ? 'animate-siuuu' : ''}
                        `}
                    >
                        <Flag className="w-8 h-6 group-hover:scale-125 transition-transform" />
                        {isAnimating ? "SIUUUUUUUU!" : "Gerar Texto"}
                    </button>

                    <button 
                        onClick={handleSurprise}
                        className="px-8 py-4 rounded-full font-bold text-tuga-green dark:text-tuga-green-bright border-2 border-tuga-green bg-white dark:bg-gray-800 shadow-[0_6px_0_#046A38] hover:-translate-y-1 hover:shadow-[0_10px_0_#046A38] active:translate-y-1 active:shadow-[0_2px_0_#046A38] transition-all flex items-center gap-2"
                    >
                        <Dice5 size={24} aria-hidden="true" />
                        Surpreende-me
                    </button>

                    <button 
                        onClick={handleCopy}
                        className={`p-4 rounded-xl border-2 transition-all active:scale-95 bg-white dark:bg-gray-800
                            ${justCopied
                                ? 'border-tuga-green text-tuga-green dark:text-tuga-green-bright'
                                : 'border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:text-tuga-gold hover:border-tuga-gold hover:rotate-6'}`}
                        title="Copiar para a área de transferência"
                        aria-label="Copiar texto para a área de transferência"
                    >
                        {justCopied
                            ? <Check size={24} aria-hidden="true" className="animate-carimbo" />
                            : <Copy size={24} aria-hidden="true" />}
                    </button>
                </div>

                <OutputBox text={outputText} animKey={lastGen?.seed ?? 0} />

                {outputText.length > 0 && (
                    <div className="mt-6 text-center">
                        <button
                            onClick={handleShare}
                            className="group text-sm font-semibold text-gray-500 dark:text-gray-400 hover:text-tuga-green dark:hover:text-tuga-green-bright transition-colors"
                            aria-label="Partilhar este texto com um link"
                        >
                            Gostas do que te saiu?{' '}
                            <span className="text-tuga-green dark:text-tuga-green-bright underline decoration-dotted underline-offset-4 group-hover:decoration-solid">
                                Atira o link a um preguiçoso
                            </span>{' '}
                            <span className="inline-block group-hover:translate-x-1 transition-transform" aria-hidden="true">👉</span>
                        </button>
                    </div>
                )}
            </div>

            <About />

            <Toast show={showToast} onClose={() => setShowToast(false)} message={toastMessage} toastKey={toastKey} />
        </main>
    )
}

export default App
