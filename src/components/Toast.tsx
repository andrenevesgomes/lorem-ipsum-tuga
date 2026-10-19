import React, { useEffect, useState } from 'react';

interface ToastProps {
    show: boolean;
    onClose: () => void;
    message?: string;
    toastKey?: number;
}

export const Toast: React.FC<ToastProps> = ({ show, onClose, message = 'Já está no bucho! (Copiado)', toastKey = 0 }) => {
    const onCloseRef = React.useRef(onClose);
    onCloseRef.current = onClose;

    // Keep the last non-empty message while the exit transition plays so the pill
    // doesn't collapse to an empty sliver mid-animation.
    const [visibleMessage, setVisibleMessage] = useState(message);

    useEffect(() => {
        if (show && message) {
            setVisibleMessage(message);
        }
    }, [show, message]);

    useEffect(() => {
        if (!show) return;
        const timer = setTimeout(() => onCloseRef.current(), 3200);
        return () => clearTimeout(timer);
    }, [show, toastKey]);

    return (
        <div
            role="status"
            aria-live="polite"
            aria-hidden={!show}
            onClick={onClose}
            className={`
                fixed bottom-6 md:bottom-10 left-1/2 -translate-x-1/2
                w-max max-w-[calc(100vw-2rem)] text-center leading-snug
                bg-red-700 text-tuga-gold font-black text-sm md:text-lg uppercase px-6 md:px-8 py-3 rounded-full
                border-4 border-tuga-gold shadow-[0_10px_30px_rgba(218,41,28,0.4)] z-50 cursor-pointer select-none
                transition-[transform,opacity] duration-300 ease-out
                ${show ? 'translate-y-0 scale-100 opacity-100' : 'translate-y-8 scale-95 opacity-0 pointer-events-none'}
            `}
        >
            <span aria-hidden="true">{visibleMessage}</span>
            <span className="sr-only">{show ? message : ''}</span>
        </div>
    );
};
