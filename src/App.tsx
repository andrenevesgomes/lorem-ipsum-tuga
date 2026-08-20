import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Controls } from './components/Controls';
import { OutputBox } from './components/OutputBox';
import { Toast } from './components/Toast';
import { generator } from './utils/generator';
import { encodeShareState, decodeShareState, randomSeed, ShareState } from './utils/urlState';
import { Copy, Check, Dice5 } from 'lucide-react';

const COPY_MESSAGE = 'Já está no bucho! (Copiado)';
const LINK_MESSAGE = 'Link copiado! Agora é só espalhar.';

function App() {
    const [darkMode, setDarkMode] = useState(true);
    const [paragraphs, setParagraphs] = useState(3);
    const [intensity, setIntensity] = useState(50);
    const [options, setOptions] = useState({
        celebrities: true,
        expressions: true,
        food: true
    });
    const [outputText, setOutputText] = useState<string[]>([]);
    const [lastGen, setLastGen] = useState<ShareState | null>(null);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState(COPY_MESSAGE);
    const [isAnimating, setIsAnimating] = useState(false);
    const [justCopied, setJustCopied] = useState(false);

    // Dark Mode Effect
    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [darkMode]);

    // Reproduce a shared generation from the URL on first load (?p=..&s=..).
    useEffect(() => {
        const shared = decodeShareState(window.location.search);
        if (!shared) return;
        setParagraphs(shared.paragraphs);
        setIntensity(shared.intensity);
        setOptions(shared.options);
        setLastGen(shared);
        setOutputText(generator.generate(shared.paragraphs, shared.intensity, shared.options, shared.seed));
    }, []);

    // Generate deterministically from a full state and reflect it in the URL, so the
    // link in the address bar always reproduces exactly what's on screen.
    const runGeneration = (state: ShareState) => {
        setIsAnimating(true);
        setTimeout(() => setIsAnimating(false), 600);

        setLastGen(state);
        setOutputText(generator.generate(state.paragraphs, state.intensity, state.options, state.seed));
        window.history.replaceState(null, '', `${window.location.pathname}?${encodeShareState(state)}`);
    };

    const handleGenerate = () => {
        runGeneration({ paragraphs, intensity, options, seed: randomSeed() });
    };

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
            setToastMessage(COPY_MESSAGE);
            setShowToast(true);
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
            setToastMessage(LINK_MESSAGE);
            setShowToast(true);
        } catch {
            // Clipboard unavailable — silently ignore.
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 md:p-8">
            <div className="w-full max-w-3xl bg-white dark:bg-gray-900 rounded-3xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] dark:shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)] p-6 md:p-12 border-t-8 border-t-tuga-green border-b-8 border-b-tuga-red relative overflow-hidden transition-colors duration-300">
                
                {/* Decorative Flag Strip */}
                <div className="absolute top-4 right-4 text-4xl opacity-20 rotate-12 select-none pointer-events-none" aria-hidden="true">
                    🇵🇹
                </div>

                <Header darkMode={darkMode} toggleDarkMode={() => setDarkMode(!darkMode)} />

                <Controls 
                    paragraphs={paragraphs} 
                    setParagraphs={setParagraphs}
                    intensity={intensity}
                    setIntensity={setIntensity}
                    options={options}
                    setOptions={setOptions}
                />

                {/* Action Buttons */}
                <div className="flex flex-wrap justify-center gap-4 mb-10">
                    <button 
                        onClick={handleGenerate}
                        className={`
                            group relative px-8 py-4 rounded-full font-black text-lg uppercase tracking-wide
                            bg-gradient-to-br from-tuga-red to-red-700 text-tuga-gold border-2 border-tuga-gold
                            shadow-[0_6px_0_#7f1d1d] active:shadow-[0_2px_0_#7f1d1d] active:translate-y-1
                            transition-all hover:-translate-y-1 hover:shadow-[0_10px_0_#7f1d1d]
                            flex items-center gap-3
                            ${isAnimating ? 'animate-siuuu' : ''}
                        `}
                    >
                        <span className="text-2xl group-hover:scale-125 transition-transform" aria-hidden="true">🇵🇹</span>
                        {isAnimating ? "SIUUUUUUUU!" : "Gerar Texto"}
                    </button>

                    <button 
                        onClick={handleSurprise}
                        className="px-8 py-4 rounded-full font-bold text-tuga-green border-2 border-tuga-green bg-white dark:bg-gray-800 shadow-[0_6px_0_#046A38] hover:-translate-y-1 hover:shadow-[0_10px_0_#046A38] active:translate-y-1 active:shadow-[0_2px_0_#046A38] transition-all flex items-center gap-2"
                    >
                        <Dice5 size={24} aria-hidden="true" />
                        Surpreende-me
                    </button>

                    <button 
                        onClick={handleCopy}
                        className={`p-4 rounded-xl border-2 transition-all bg-white dark:bg-gray-800
                            ${justCopied
                                ? 'border-tuga-green text-tuga-green'
                                : 'border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:text-tuga-gold hover:border-tuga-gold hover:rotate-6'}`}
                        title="Copiar para a área de transferência"
                        aria-label="Copiar texto para a área de transferência"
                    >
                        {justCopied
                            ? <Check size={24} aria-hidden="true" className="animate-carimbo" />
                            : <Copy size={24} aria-hidden="true" />}
                    </button>
                </div>

                <OutputBox text={outputText} />

                {outputText.length > 0 && (
                    <div className="mt-6 text-center">
                        <button
                            onClick={handleShare}
                            className="group text-sm font-semibold text-gray-500 dark:text-gray-400 hover:text-tuga-green transition-colors"
                            aria-label="Partilhar este texto com um link"
                        >
                            Gostas do que te saiu?{' '}
                            <span className="text-tuga-green underline decoration-dotted underline-offset-4 group-hover:decoration-solid">
                                Atira o link a um preguiçoso
                            </span>{' '}
                            <span className="inline-block group-hover:translate-x-1 transition-transform" aria-hidden="true">👉</span>
                        </button>
                    </div>
                )}
            </div>

            <Toast show={showToast} onClose={() => setShowToast(false)} message={toastMessage} />
        </div>
    )
}

export default App
