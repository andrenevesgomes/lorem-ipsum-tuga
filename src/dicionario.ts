import { inject } from '@vercel/analytics';
import './index.css';

// The page is static: production HTML is prerendered at build time, so the only
// script it needs is analytics. In dev there is no prerender, so render it here.
inject();

if (import.meta.env.DEV) {
    // No JSX here: it would pull React's JSX runtime into the production bundle.
    Promise.all([import('react'), import('react-dom/client'), import('./components/Dicionario')]).then(
        ([{ createElement }, { createRoot }, { Dicionario }]) => {
            createRoot(document.getElementById('root')!).render(createElement(Dicionario));
        },
    );
}
