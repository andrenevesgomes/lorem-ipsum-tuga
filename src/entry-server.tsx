import { renderToString } from 'react-dom/server';
import App from './App';

// Build-time render of the app shell so crawlers and social scrapers get real
// HTML instead of an empty <div id="root">. The client re-renders on load.
export function render(): string {
  return renderToString(<App />);
}
