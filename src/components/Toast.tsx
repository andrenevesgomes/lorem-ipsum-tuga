import React, { useEffect } from 'react';

interface ToastProps {
    show: boolean;
    onClose: () => void;
    message?: string;
}

export const Toast: React.FC<ToastProps> = ({ show, onClose, message = 'Já está no bucho! (Copiado)' }) => {
    useEffect(() => {
        if (show) {
            const timer = setTimeout(onClose, 3000);
            return () => clearTimeout(timer);
        }
    }, [show, onClose]);

    return (
        <div 
            role="status"
            aria-live="polite"
            className={`
                fixed bottom-10 left-1/2 -translate-x-1/2 
                bg-tuga-red text-tuga-gold font-black text-lg uppercase px-8 py-3 rounded-full 
                border-4 border-tuga-gold shadow-[0_10px_30px_rgba(218,41,28,0.4)] z-50
                transition-all duration-500 ease-out transform
                ${show ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0 pointer-events-none'}
            `}
        >
            {show ? message : ''}
        </div>
    );
};
