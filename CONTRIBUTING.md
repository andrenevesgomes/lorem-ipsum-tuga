# Como contribuir sem estragar o chouriço

Obrigado por quereres meter a mão na massa. Antes de abrires um PR, lê isto: são duas páginas, menos que a fila das Finanças.

## Antes de mandar o PR

```bash
pnpm install
pnpm test
pnpm build
```

Se o `pnpm build` falhar com "Relative import paths need explicit file extensions", falta um `.js` num import usado por `api/` ou `middleware.ts` (a Vercel corre esses ficheiros como ESM em Node, sem bundling).

O `pnpm` só instala versões publicadas há pelo menos 3 dias (`minimumReleaseAge`). Se uma versão acabou de sair, espera um bocadinho.

## A voz do projeto

- **Português de Portugal**, sempre. Nada de "você", "tela" ou "celular".
- **Tu, nunca você.** Fala-se como à mesa do café: "Carrega no botão, ó campeão."
- **Frases curtas, com ponto de exclamação quando apetece.** O humor está no ritmo, não no tamanho.
- **Calão e oralidade são de propósito**: "Comó Milho", "tás a ver?", "mai nada", "bué", "carago". Não se corrigem.
- **Referências que toda a gente apanha**: futebol (SIUUU), Finanças, IC19, francesinha, Leiria que não existe, o primo da Suíça.
- **Inglês só onde um dev português o usaria**: layout, preview, dark mode.
- **A piada nunca é à custa de alguém real ou de um grupo.** Figuras públicas aparecem em situações caricatas, não em crimes, doenças ou insultos.

Exemplos:

| Em vez de | Escreve |
|---|---|
| "Texto copiado com sucesso." | "Já está no bucho! (Copiado)" |
| "Erro: página não encontrada." | "Este chouriço não existe. Tal como Leiria." |
| "Clique aqui para partilhar." | "Atira o link a um preguiçoso." |

## Adicionar expressões

Vai a `src/data/dictionary.ts`. Antes de adicionar:

- Lê a frase completa: sujeito + ação + complemento tem de soar bem em voz alta.
- Não dupliques nem faças variações quase iguais ("foi ao café", "foi à pastelaria"...). Uma boa vale mais que dez de enchimento.
- Ações com culpa ou crime (multas, fisco, bebedeiras) não podem calhar a figuras públicas reais.
- Se mudares o dicionário, os links partilhados antigos passam a mostrar outro texto. Faz parte.

### Atualidade

As piadas do momento vivem em `src/data/atualidade.ts`, separadas do resto para serem fáceis de trocar. No dia 1 de cada mês o workflow "Atualidade do mês" recolhe títulos do Observador, Público e RTP (já sem tragédias, crimes e guerras), abre uma issue e entrega-a ao Copilot, que abre um PR. Um humano revê sempre antes do merge.

- Temas leves que toda a gente apanhou: impostos, calor fora de época, filas, futebol, casas pela hora da morte.
- A piada é sobre a situação, não sobre uma pessoa real. Nada de tragédias, crimes, guerras ou mortes.
- Tira o que já ninguém se lembra e atualiza `revistoEm`.

## Mensagens de commit

Formato [Conventional Commits](https://www.conventionalcommits.org/), em português de Portugal, com acentos:

```
tipo(âmbito): o que mudou, numa frase
```

- **Assunto até ~72 caracteres**, a dizer o que mudou. A piada é bem-vinda, mas tem de se perceber o que foi feito sem ela.
- **Corpo** (opcional): o porquê, em texto normal.
- **Emoji**: no máximo um, no fim, e só em `feat`/conteúdo.

Quando há humor: `feat`, conteúdo do dicionário, textos da interface, casos caricatos.

```
feat(dicionário): menos "foi ao X", mais desgraças de tasca 🐟
fix(gerador): o calão já não cai a meio do verbo
feat: página 404 à tuga e cache offline mais leve
```

Quando é sério: segurança, acessibilidade, deploy, dependências, reverts. Claro e direto.

```
fix(a11y): contraste AA no modo escuro
ci: fixar runners em ubuntu-24.04
chore(deps): bump vite from 6.4.3 to 6.4.5
revert: "feat: botão que grita"
```

Proibido: `update`, `fix`, `changes`, `final version`, `agora funciona`.
