import React from 'react';

interface ControlsProps {
    paragraphs: number;
    setParagraphs: (val: number) => void;
    intensity: number;
    setIntensity: (val: number) => void;
    options: {
        celebrities: boolean;
        expressions: boolean;
        food: boolean;
    };
    setOptions: React.Dispatch<React.SetStateAction<{
        celebrities: boolean;
        expressions: boolean;
        food: boolean;
    }>>;
}

export const Controls: React.FC<ControlsProps> = ({ 
    paragraphs, setParagraphs, 
    intensity, setIntensity,
    options, setOptions 
}) => {

    const getIntensityLabel = (val: number) => {
        if (val < 25) return "Suave";
        if (val < 50) return "Equilibrado";
        if (val < 75) return "Comó Milho";
        return "Azeiteiro";
    };

    const handleCheckboxChange = (key: keyof typeof options) => {
        setOptions(prev => ({ ...prev, [key]: !prev[key] }));
    };

    return (
        <div className="flex flex-col gap-8 mb-10">
            {/* Paragraph Counter */}
            <div className="flex flex-col items-center gap-4">
                <label className="font-extrabold text-tuga-green uppercase tracking-wider text-sm" id="paragraphs-label">
                    Quantos parágrafos?
                </label>
                <div className="flex items-center gap-4 bg-white dark:bg-gray-800 p-2 rounded-full border-2 border-gray-100 dark:border-gray-700 shadow-inner">
                    <button 
                        onClick={() => setParagraphs(Math.max(1, paragraphs - 1))}
                        aria-label="Menos um parágrafo"
                        className="w-10 h-10 rounded-full border-2 border-tuga-green bg-white dark:bg-gray-700 text-tuga-green dark:text-tuga-gold font-black text-xl hover:bg-tuga-green hover:text-white transition-all active:scale-90 flex items-center justify-center"
                    >
                        -
                    </button>
                    <span
                        className="w-12 text-center text-2xl font-black text-gray-800 dark:text-white"
                        aria-live="polite"
                        aria-labelledby="paragraphs-label"
                    >
                        {paragraphs}
                    </span>
                    <button 
                        onClick={() => setParagraphs(Math.min(10, paragraphs + 1))}
                        aria-label="Mais um parágrafo"
                        className="w-10 h-10 rounded-full border-2 border-tuga-green bg-white dark:bg-gray-700 text-tuga-green dark:text-tuga-gold font-black text-xl hover:bg-tuga-green hover:text-white transition-all active:scale-90 flex items-center justify-center"
                    >
                        +
                    </button>
                </div>
            </div>

            {/* Intensity Slider */}
            <div className="flex flex-col items-center gap-4 w-full max-w-md mx-auto">
                <label
                    htmlFor="intensity-slider"
                    className="font-extrabold text-tuga-green uppercase tracking-wider text-sm"
                >
                    Nível de Tuga:
                </label>
                <input 
                    id="intensity-slider"
                    type="range" 
                    min="1" 
                    max="100" 
                    value={intensity}
                    onChange={(e) => setIntensity(parseInt(e.target.value))}
                    aria-valuetext={getIntensityLabel(intensity)}
                    className="w-full h-3 bg-gradient-to-r from-tuga-green via-tuga-green to-tuga-red rounded-lg appearance-none cursor-pointer accent-tuga-gold"
                />
                <span className="font-bold text-tuga-red text-lg uppercase bg-white dark:bg-gray-800 border-2 border-tuga-gold px-4 py-1 rounded-full shadow-sm">
                    {getIntensityLabel(intensity)}
                </span>
            </div>

            {/* Checkboxes */}
            <div className="flex flex-wrap justify-center gap-4">
                {[
                    { key: 'celebrities', label: 'Figuras Públicas' },
                    { key: 'expressions', label: 'Expressões Típicas' },
                    { key: 'food', label: 'Comida' }
                ].map((opt) => (
                    <label 
                        key={opt.key}
                        className={`
                            flex items-center gap-3 px-5 py-3 rounded-xl border-2 cursor-pointer transition-all select-none font-bold text-sm
                            ${options[opt.key as keyof typeof options] 
                                ? 'border-tuga-green text-tuga-green bg-green-50 dark:bg-green-900/20' 
                                : 'border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 hover:border-tuga-green'}
                        `}
                    >
                        <input 
                            type="checkbox" 
                            checked={options[opt.key as keyof typeof options]}
                            onChange={() => handleCheckboxChange(opt.key as keyof typeof options)}
                            className="sr-only peer"
                        />
                        <div className={`
                            w-5 h-5 rounded border-2 flex items-center justify-center transition-colors
                            peer-focus-visible:ring-2 peer-focus-visible:ring-tuga-gold peer-focus-visible:ring-offset-2 dark:peer-focus-visible:ring-offset-gray-800
                            ${options[opt.key as keyof typeof options] ? 'bg-tuga-red border-tuga-red' : 'bg-gray-100 border-gray-300 dark:bg-gray-700 dark:border-gray-600'}
                        `}>
                            {options[opt.key as keyof typeof options] && (
                                <svg className="w-3 h-3 text-white fill-current" viewBox="0 0 20 20">
                                    <path d="M0 11l2-2 5 5L18 3l2 2L7 18z"/>
                                </svg>
                            )}
                        </div>
                        {opt.label}
                    </label>
                ))}
            </div>
        </div>
    );
};
