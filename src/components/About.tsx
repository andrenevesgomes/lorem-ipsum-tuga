import React from 'react';

export const About: React.FC = () => (
    <section
        aria-labelledby="porque-titulo"
        className="w-full max-w-3xl px-2 md:px-4 text-gray-700 dark:text-gray-300 leading-relaxed"
    >
        <h2 id="porque-titulo" className="text-2xl md:text-3xl font-black text-tuga-red dark:text-red-400 uppercase tracking-tight mb-3">
            Porquê «encher chouriços»?
        </h2>
        <p className="mb-6">
            Em Portugal, <strong>encher chouriços</strong> é escrever muito para dizer pouco: o relatório que
            precisava de mais duas páginas, a redação da escola, o email que podia ser uma frase. É exatamente o que
            o Lorem Ipsum faz num layout, só que em latim e sem graça nenhuma.
        </p>

        <div className="grid gap-6 md:grid-cols-3">
            <div>
                <h3 className="font-extrabold text-tuga-green dark:text-tuga-green-bright uppercase tracking-wider text-sm mb-2">
                    Para que serve?
                </h3>
                <p>
                    Texto de preenchimento em português de Portugal para maquetes, protótipos e wireframes. Tem
                    acentos, cedilhas e palavras compridas a sério, por isso vês logo se a tua fonte aguenta o «ç», o
                    «ã» e o «õ».
                </p>
            </div>
            <div>
                <h3 className="font-extrabold text-tuga-green dark:text-tuga-green-bright uppercase tracking-wider text-sm mb-2">
                    Posso usar à vontade?
                </h3>
                <p>
                    Podes. É gratuito, corre todo no teu browser e não guarda nada do que geras. Só não o mandes ao
                    cliente como texto final (já aconteceu, não perguntes).
                </p>
            </div>
            <div>
                <h3 className="font-extrabold text-tuga-green dark:text-tuga-green-bright uppercase tracking-wider text-sm mb-2">
                    E o Lorem Ipsum original?
                </h3>
                <p>
                    Vem de um texto de Cícero, baralhado há séculos por tipógrafos. Esta é a versão tuga: em vez de
                    «dolor sit amet», tens o emplastro na rotunda do Marquês.
                </p>
            </div>
        </div>

        <p className="mt-8 text-center">
            Não percebeste metade?{' '}
            <a
                href="/dicionario"
                className="font-semibold text-tuga-green dark:text-tuga-green-bright underline underline-offset-4"
            >
                Há um dicionário
            </a>
            .
        </p>

        <p className="mt-8 text-sm text-center text-gray-600 dark:text-gray-400">
            Feito com azeite em Portugal.{' '}
            <a
                href="https://github.com/andrenevesgomes/lorem-ipsum-tuga"
                className="font-semibold text-tuga-green dark:text-tuga-green-bright underline underline-offset-4"
            >
                O código está no GitHub
            </a>
            {' e podes '}
            <a
                href="https://github.com/andrenevesgomes/lorem-ipsum-tuga/issues/new?template=sugerir-expressao.yml"
                className="font-semibold text-tuga-green dark:text-tuga-green-bright underline underline-offset-4"
            >
                sugerir uma expressão nova
            </a>
            .
        </p>
    </section>
);
