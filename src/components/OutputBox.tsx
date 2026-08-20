import React from 'react';

interface OutputBoxProps {
    text: string[];
}

export const OutputBox: React.FC<OutputBoxProps> = ({ text }) => {
    return (
        <div
            className="relative bg-white dark:bg-gray-800 border-4 border-tuga-green rounded-2xl p-8 min-h-[150px] text-left shadow-inner transition-colors duration-300"
            aria-live="polite"
        >
            {text.length === 0 ? (
                <div className="absolute inset-0 flex items-center justify-center text-gray-400 dark:text-gray-500 font-semibold italic px-6 text-center">
                    Ainda não há chouriço nenhum. Carrega no botão, ó campeão.
                </div>
            ) : (
                <div id="output-text" className="space-y-6">
                    {text.map((paragraph, idx) => (
                        <p key={idx} className="text-lg leading-relaxed text-gray-800 dark:text-gray-200 animate-slide-up">
                            {paragraph}
                        </p>
                    ))}
                </div>
            )}
            
            <div className="absolute bottom-3 right-4 text-2xl opacity-50 select-none pointer-events-none" aria-hidden="true">
                🇵🇹
            </div>
        </div>
    );
};
