import React from 'react';
import { Flag } from './Flag';
import { ancora, glossario } from '../data/glossario';

const SITE = 'https://encher-chouricos.vercel.app';

// Escape "<" so a definition can never close the <script> tag early.
const jsonLd = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'DefinedTermSet',
    name: 'Dicionário Tuga',
    url: `${SITE}/dicionario`,
    inLanguage: 'pt-PT',
    hasDefinedTerm: glossario.flatMap((categoria) =>
        categoria.entradas.map((entrada) => ({
            '@type': 'DefinedTerm',
            name: entrada.termo,
            description: entrada.definicao,
            url: `${SITE}/dicionario#${ancora(entrada.termo)}`,
        })),
    ),
}).replace(/</g, '\\u003c');

const linkClass =
    'font-semibold text-tuga-green dark:text-tuga-green-bright underline underline-offset-4';

export const Dicionario: React.FC = () => (
    <main className="min-h-screen flex flex-col items-center gap-12 p-4 md:p-8">
        <article className="w-full max-w-3xl bg-white dark:bg-gray-900 rounded-3xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] dark:shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)] p-6 md:p-12 border-t-8 border-t-tuga-green border-b-8 border-b-tuga-red relative overflow-hidden text-gray-700 dark:text-gray-300 leading-relaxed">
            <Flag className="absolute top-4 right-4 w-12 h-8 opacity-20 rotate-12 select-none pointer-events-none" />

            <a href="/" className={`${linkClass} text-sm`}>
                ← Voltar ao gerador
            </a>

            <h1 className="mt-6 text-4xl md:text-5xl font-black text-tuga-red uppercase tracking-tighter mb-4 drop-shadow-[2px_2px_0px_rgba(255,215,0,1)]">
                Dicionário Tuga
            </h1>
            <p className="text-lg mb-6">
                O gerador fala português de Portugal, e do mais castiço. Se não és de cá, ou se és mas não tens avó
                no Norte, aqui fica o que quer dizer cada coisa que lhe sai da boca.
            </p>

            <nav aria-label="Categorias" className="mb-10">
                <ul className="flex flex-wrap gap-2 text-sm">
                    {glossario.map((categoria) => (
                        <li key={categoria.id}>
                            <a
                                href={`#${categoria.id}`}
                                className="inline-block px-3 py-1 rounded-full border-2 border-tuga-green text-tuga-green dark:text-tuga-green-bright font-semibold hover:bg-tuga-green hover:text-white dark:hover:text-white transition-colors"
                            >
                                {categoria.titulo}
                            </a>
                        </li>
                    ))}
                </ul>
            </nav>

            {glossario.map((categoria) => (
                <section key={categoria.id} aria-labelledby={categoria.id} className="mb-10 last-of-type:mb-0">
                    <h2
                        id={categoria.id}
                        className="scroll-mt-6 text-2xl md:text-3xl font-black text-tuga-red dark:text-red-400 uppercase tracking-tight mb-4"
                    >
                        {categoria.titulo}
                    </h2>
                    <dl className="grid gap-5">
                        {categoria.entradas.map((entrada) => (
                            <div key={entrada.termo} id={ancora(entrada.termo)} className="scroll-mt-6">
                                <dt className="font-extrabold text-lg text-tuga-green dark:text-tuga-green-bright">
                                    {entrada.termo}
                                </dt>
                                <dd>{entrada.definicao}</dd>
                                <dd className="mt-1 italic text-gray-600 dark:text-gray-400">«{entrada.exemplo}»</dd>
                            </div>
                        ))}
                    </dl>
                </section>
            ))}

            <p className="mt-12 text-center">
                <a
                    href="/"
                    className="inline-block px-8 py-4 rounded-full font-black text-lg uppercase tracking-wide bg-linear-to-br/srgb from-tuga-red to-red-700 text-tuga-gold border-2 border-tuga-gold shadow-[0_6px_0_#7f1d1d] hover:-translate-y-1 hover:shadow-[0_10px_0_#7f1d1d] transition-all"
                >
                    Já percebeste? Vai gerar um chouriço
                </a>
            </p>
        </article>

        <p className="text-sm text-center text-gray-600 dark:text-gray-400">
            Falta aqui alguma?{' '}
            <a
                href="https://github.com/andrenevesgomes/lorem-ipsum-tuga/issues/new?template=sugerir-expressao.yml"
                className={linkClass}
            >
                Sugere uma expressão
            </a>
            .
        </p>

        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />
    </main>
);
