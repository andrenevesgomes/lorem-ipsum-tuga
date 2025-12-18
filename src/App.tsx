import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Controls } from './components/Controls';
import { OutputBox } from './components/OutputBox';
import { Toast } from './components/Toast';
import { generator } from './utils/generator';
import { Copy, Dice5 } from 'lucide-react';

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
    const [showToast, setShowToast] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);

    // Dark Mode Effect
    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [darkMode]);

    const handleGenerate = () => {
        setIsAnimating(true);
        setTimeout(() => setIsAnimating(false), 600);
        
        const text = generator.generate(paragraphs, intensity);
        setOutputText(text);
    };

    const handleSurprise = () => {
        setParagraphs(Math.floor(Math.random() * 5) + 1);
        setIntensity(Math.floor(Math.random() * 100) + 1);
        setOptions({
            celebrities: Math.random() > 0.5,
            expressions: Math.random() > 0.5,
            food: Math.random() > 0.5
        });
        // We need to wait for state update or just generate immediately with new random values
        // For simplicity, let's just trigger a generate with the new random values directly
        const p = Math.floor(Math.random() * 5) + 1;
        const i = Math.floor(Math.random() * 100) + 1;
        const text = generator.generate(p, i);
        setOutputText(text);
    };

    const handleCopy = () => {
        if (outputText.length > 0) {
            navigator.clipboard.writeText(outputText.join('\n\n'));
            setShowToast(true);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 md:p-8">
            <div className="w-full max-w-3xl bg-white dark:bg-gray-900 rounded-3xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] dark:shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)] p-6 md:p-12 border-t-8 border-t-tuga-green border-b-8 border-b-tuga-red relative overflow-hidden transition-colors duration-300">
                
                {/* Decorative Flag Strip */}
                <div className="absolute top-4 right-4 text-4xl opacity-20 rotate-12 select-none pointer-events-none">
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
                        <span className="text-2xl group-hover:scale-125 transition-transform">🇵🇹</span>
                        {isAnimating ? "SIUUUUUUUU!" : "Gerar Texto"}
                    </button>

                    <button 
                        onClick={handleSurprise}
                        className="px-8 py-4 rounded-full font-bold text-tuga-green border-2 border-tuga-green bg-white dark:bg-gray-800 shadow-[0_6px_0_#046A38] hover:-translate-y-1 hover:shadow-[0_10px_0_#046A38] active:translate-y-1 active:shadow-[0_2px_0_#046A38] transition-all flex items-center gap-2"
                    >
                        <Dice5 size={24} />
                        Surpreende-me
                    </button>

                    <button 
                        onClick={handleCopy}
                        className="p-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:text-tuga-gold hover:border-tuga-gold hover:rotate-6 transition-all bg-white dark:bg-gray-800"
                        title="Copiar para a área de transferência"
                    >
                        <Copy size={24} />
                    </button>
                </div>

                <OutputBox text={outputText} />
            </div>

            <Toast show={showToast} onClose={() => setShowToast(false)} />
        </div>
    )
}

export default App
