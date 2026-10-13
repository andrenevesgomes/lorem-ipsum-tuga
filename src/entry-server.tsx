import { renderToString } from 'react-dom/server';
import App from './App';
import { Dicionario } from './components/Dicionario';

// Build-time render of the app shell so crawlers and social scrapers get real
// HTML instead of an empty <div id="root">. The client re-renders on load.
export function render(): string {
  return renderToString(<App />);
}

// The dictionary is static: this HTML is all it ever needs.
export function renderDicionario(): string {
  return renderToString(<Dicionario />);
}
