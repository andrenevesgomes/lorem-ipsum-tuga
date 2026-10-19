import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { Flag } from './Flag';

interface HeaderProps {
    darkMode: boolean;
    toggleDarkMode: () => void;
    onFlagClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ darkMode, toggleDarkMode, onFlagClick }) => {
    return (
        <div className="relative mb-8">
            <button 
                onClick={toggleDarkMode}
                className="absolute top-0 right-0 p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-yellow-400 transition-colors hover:scale-110 z-10"
                title={darkMode ? "Modo Claro" : "Modo Escuro"}
                aria-label={darkMode ? "Mudar para modo claro" : "Mudar para modo escuro"}
            >
                {darkMode ? <Sun size={20} aria-hidden="true" /> : <Moon size={20} aria-hidden="true" />}
            </button>
            
            <h1 className="text-4xl md:text-5xl font-black text-tuga-red uppercase tracking-tighter mb-2 drop-shadow-[2px_2px_0px_rgba(255,215,0,1)]">
                <span onClick={onFlagClick} className="inline-block cursor-pointer select-none">
                    <Flag className="inline-block w-11 h-8 md:w-14 md:h-10 mr-3 align-[-0.12em]" />
                </span>
                Lorem Ipsum Tuga
            </h1>
            <p className="text-lg font-semibold text-gray-600 dark:text-gray-400 border-b-2 border-gray-200 dark:border-gray-700 inline-block pb-1">
                O gerador de texto oficial para encher chouriços com orgulho nacional.
            </p>
        </div>
    );
};
