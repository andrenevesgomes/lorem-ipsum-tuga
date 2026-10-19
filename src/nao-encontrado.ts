import { inject } from '@vercel/analytics';
import './index.css';

inject();

const $ = <T extends HTMLElement = HTMLElement>(id: string) => document.getElementById(id) as T;

// 1875 (Bordalo Pinheiro) vs Today: why the page isn't here, and why nothing ever changes.
const CRONICAS: Array<[string, string, string]> = [
    [
        'Prometeram o caminho de ferro até à tua página.',
        'Criaram uma comissão parlamentar, caiu o portal e ficaste com um 404.',
        'Toma lá um manguito oficial',
    ],
    [
        'O Zé pagava o imposto do real d’água e ficava a ver navios.',
        'Pagas o IVA a 23% sobre os bytes desta página e ela nem sequer abre.',
        'Continua tudo como dantes',
    ],
    [
        'Faltava o carimbo de lacre do amanuense do Terreiro do Paço.',
        'Falta o anexo 7-B em PDF assinado com Chave Móvel Digital caducada.',
        'Volte amanhã entre as 9h00 e as 9h02',
    ],
    [
        'A mala-posta de Lisboa para o Porto levava três dias e perdia as cartas.',
        'A fibra ótica leva 3 milissegundos a dizer que a página foi comer um pastel de nata.',
        'Progresso à portuguesa',
    ],
    [
        'Culparam o défice do Reino, a filoxera e o Ultimato Inglês.',
        'Culpam o estagiário, o DNS, a gota fria e o árbitro do VAR.',
        'A culpa nunca é de ninguém',
    ],
    [
        'O ministro inaugurou o fontanário com banda filarmónica e foguetes.',
        'Inauguraram este URL em PowerPoint, mas esqueceram-se de fazer a página.',
        'Obra adjudicada ao primo',
    ],
    [
        'O paquete para o Brasil partiu sem o despacho e ninguém deu por isso.',
        'O deploy foi numa sexta-feira às 18h59 e a equipa já estava na imperial.',
        'Quem vier atrás que feche a porta',
    ],
    [
        'As obras de Santa Engrácia levavam séculos e nunca mais tinham fim.',
        'O novo aeroporto abre em 2037 — e esta página logo a seguir.',
        'Prazo indicativo (século XXI)',
    ],
    [
        'Pediam uma cunha ao senhor deputado da Regeneração para desencalhar o papel.',
        'Tens de conhecer o primo do gajo de IT que tem a password do servidor.',
        'Sem cunha não há página',
    ],
    [
        'O telégrafo avariou porque choveu no Rossio.',
        'A cloud foi abaixo porque alguém desligou a tripla para ligar o aquecedor.',
        'Tecnologia de ponta',
    ],
    [
        'O amanuense saiu às onze para almoçar cozido e só voltou na terça-feira.',
        'O servidor entrou em «pausa para bica» e deixou um bilhete no ecrã.',
        'Já volto (de certeza)',
    ],
    [
        'Juravam que D. Sebastião vinha aí num cavalo branco resolver a crise.',
        'Juram que a Inteligência Artificial resolve isto no próximo sprint.',
        'Esperar sentado em Alcácer Quibir',
    ],
    [
        'Mandaram fazer um inquérito real em papel selado de trinta réis.',
        'Abriram um ticket em Jira com prioridade «Quando Houver Tempo».',
        'Arquivado na gaveta do fundo',
    ],
    [
        'O barco a vapor do Tejo ficou preso no lodo do Cais do Sodré.',
        'O teu pedido ficou preso na Segunda Circular atrás de um TVDE em segunda fila.',
        'Mais cinco minutinhos',
    ],
    [
        'Vendiam cautelas da Lotaria da Misericórdia para tapar o buraco do orçamento.',
        'Raspaste uma raspadinha e saiu-te este 404 sem direito a reembolso.',
        'Tente novamente na próxima encarnação',
    ],
    [
        'O comboio do Norte parou no Entroncamento porque faltava carvão.',
        'O pacote de rede parou em Leiria e descobriu que Leiria não existe.',
        'Fim de linha',
    ],
    [
        'O regedor da freguesia trancou a repartição e levou a chave para a vindima.',
        'O administrador do sistema foi passar a ponte ao Algarve e levou o portátil.',
        'Férias são sagradas',
    ],
    [
        'Bordalo desenhava o Zé de braços abertos a olhar para o vazio.',
        'Tu olhas para este 404, o Zé olha para ti, e ficamos todos na mesma.',
        '151 anos de consistência',
    ],
];

// The address the visitor typed, shown as text (never as HTML).
let caminho = window.location.pathname;
try {
    caminho = decodeURIComponent(caminho);
} catch {
    // Malformed escape: show it as typed.
}
$('caminho').textContent = `«${caminho.length > 40 ? caminho.slice(0, 39) + '…' : caminho}»`;
$('anos').textContent = String(Math.max(151, new Date().getFullYear() - 1875));

// Easter eggs for iconic Portuguese missing things.
const slug = caminho.toLowerCase();
if (slug.includes('leiria')) {
    CRONICAS.unshift([
        'Em 1875 já ninguém conseguia apontar Leiria no mapa sem rir.',
        'Tentaste abrir «/leiria» e deu 404. Fica oficialmente provado que Leiria não existe.',
        'Mito confirmado pela ciência',
    ]);
} else if (slug.includes('sebastiao') || slug.includes('sebastião')) {
    CRONICAS.unshift([
        'D. Sebastião disse que ia ali a Alcácer Quibir e voltava já.',
        'Ainda está nevoeiro no servidor. Volta numa manhã de sol.',
        'À espera desde 1578',
    ]);
} else if (slug.includes('olivenca') || slug.includes('olivença')) {
    CRONICAS.unshift([
        'Em 1815, no Congresso de Viena, prometeram devolver Olivença.',
        'Esta página é como Olivença: é nossa por direito, mas não aparece.',
        'Olivença é nossa',
    ]);
}

const folha = $('folha');
const carimbo = $('carimbo');
const antes = $('antes');
const agora = $('agora');
const gravura = $('gravura');
const estado = $('estado');
const quatro = $('quatro');
const virar = $<HTMLButtonElement>('virar');
const voltarTexto = $('voltar-texto');

const total = CRONICAS.length;
let idx = 0;

function mostrarCronica(animar: boolean) {
    const [ontem, hoje, selo] = CRONICAS[idx % total];
    const num = (idx % total) + 1;
    idx++;

    antes.textContent = ontem;
    agora.textContent = hoje;
    carimbo.textContent = selo;
    folha.textContent = `Crónica ${num} de ${total}`;

    const prox = (idx % total) + 1;
    virar.textContent =
        idx >= total
            ? `📰 Recomeçar as crónicas (${prox}/${total})`
            : `📰 Virar a página de 1875 (${prox}/${total})`;

    if (idx === 5) {
        voltarTexto.textContent = 'Já me fartei, leva-me ao gerador';
    } else if (idx >= 10) {
        voltarTexto.textContent = 'Chega de 1875, quero encher chouriços!';
    }

    if (animar) {
        for (const el of [antes, agora]) {
            el.classList.remove('animate-slide-up');
            void el.offsetWidth;
            el.classList.add('animate-slide-up');
        }
        quatro.classList.remove('animate-siuuu');
        carimbo.classList.remove('animate-carimbo');
        void quatro.offsetWidth;
        quatro.classList.add('animate-siuuu');
        carimbo.classList.add('animate-carimbo');
    }

    estado.textContent = `Crónica ${num} de ${total}: Em 1875, ${ontem} Hoje, ${hoje}`;
}

virar.hidden = false;
virar.addEventListener('click', () => mostrarCronica(true));
gravura.addEventListener('click', () => mostrarCronica(true));
mostrarCronica(false);
