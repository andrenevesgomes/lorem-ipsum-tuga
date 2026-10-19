import React from 'react'
import ReactDOM from 'react-dom/client'
import { Analytics } from '@vercel/analytics/react'
import App from './App.tsx'
import './index.css'

console.log(
  '%c🇵🇹 O que é que estás aqui a espreitar, ó artista?\n%cVai mas é trabalhar — ou ajuda a encher mais chouriços: https://github.com/andrenevesgomes/lorem-ipsum-tuga',
  'color:#DA291C;font-weight:900;font-size:15px;',
  'color:#046A38;font-weight:700;font-size:12px;',
)

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
    <Analytics />
  </React.StrictMode>,
)
