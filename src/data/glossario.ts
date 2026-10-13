// Explains the expressions the generator throws around, for anyone who wasn't
// raised on bifanas. Every entry must appear in the generator (see glossario.test.ts),
// so this page never explains something the visitor will never see.

export interface Entrada {
    termo: string;
    /** Text that must exist in the generator data or UI; defaults to `termo`. */
    procura?: string;
    definicao: string;
    exemplo: string;
}

export interface Categoria {
    id: string;
    titulo: string;
    entradas: Entrada[];
}

export const glossario: Categoria[] = [
    {
        id: 'a-da-casa',
        titulo: 'A da casa',
        entradas: [
            {
                termo: 'Encher chouriços',
                definicao:
                    'Escrever muito para dizer pouco, como quem enche a tripa com o que houver à mão. É o relatório que precisava de mais duas páginas e, já agora, o que este site faz por ti.',
                exemplo: 'O gerador de texto oficial para encher chouriços com orgulho nacional.',
            },
            {
                termo: 'Comó milho',
                procura: 'Comó Milho',
                definicao:
                    'Às carradas, em quantidade industrial. Vem de «como o milho», que nunca falta. É o terceiro nível de tuga do gerador.',
                exemplo: 'Havia gente comó milho na fila das Finanças.',
            },
            {
                termo: 'Azeiteiro',
                definicao:
                    'Pirosão, exibido, de gosto duvidoso e com orgulho nisso. Fio de ouro, camisa aberta e música alta no carro. É o nível máximo do gerador.',
                exemplo: 'Puseste o nível no Azeiteiro? Então aguenta.',
            },
            {
                termo: 'SIUUU',
                definicao:
                    'O grito do Cristiano Ronaldo a festejar golos, adotado pela nação para festejar qualquer coisa: um golo, uma promoção ou um texto bem gerado.',
                exemplo: 'Carregas em Gerar Texto e o botão grita SIUUUUUUUU!',
            },
        ],
    },
    {
        id: 'para-comecar',
        titulo: 'Para começar a conversa',
        entradas: [
            {
                termo: 'Epá',
                definicao:
                    'De «eh, pá». Serve para tudo: espanto, hesitação, desabafo ou só para ganhar tempo enquanto se pensa no resto da frase.',
                exemplo: 'Epá, o taxista foi ao fado com a sogra atrás.',
            },
            {
                termo: 'Pá',
                procura: ', pá!',
                definicao:
                    'Redução de «rapaz», mas aplica-se a qualquer pessoa, de qualquer idade. Funciona como vírgula falada no fim da frase.',
                exemplo: 'O árbitro foi ver o Benfica, pá!',
            },
            {
                termo: 'Ó chefe',
                definicao:
                    'Forma de chamar alguém que não é nosso chefe de coisa nenhuma: o empregado de mesa, o arrumador, o senhor da bomba de gasolina.',
                exemplo: 'Ó chefe, o vizinho do 3.º esquerdo mandou vir um bitoque.',
            },
            {
                termo: 'Diz que',
                definicao:
                    'Abre um boato sem fonte, mas com toda a certeza. Quem disse? Diz que.',
                exemplo: 'Diz que o Zé Povinho partiu a loiça toda no Chiado.',
            },
        ],
    },
    {
        id: 'para-acabar',
        titulo: 'Para acabar em grande',
        entradas: [
            {
                termo: 'Carago',
                definicao:
                    'Interjeição do Norte, sobretudo do Porto, para espanto, irritação ou entusiasmo. É a versão de família de uma palavra bem mais forte.',
                exemplo: 'O treinador de bancada ficou a ver navios, carago!',
            },
            {
                termo: 'Fónix',
                definicao:
                    'Palavrão disfarçado para se poder dizer à frente da avó. A avó percebe na mesma.',
                exemplo: 'O patrão apanhou uma seca na Loja do Cidadão, fónix!',
            },
            {
                termo: 'Mai nada',
                definicao:
                    '«E mais nada», com sotaque. Fecha a discussão: está dito, não há recurso.',
                exemplo: 'O estagiário foi comprar tabaco, mai nada!',
            },
            {
                termo: 'Cum caneco',
                definicao:
                    'Exclamação de espanto ou irritação, do tempo em que ainda se praguejava com cuidado.',
                exemplo: 'A Tia de Cascais pediu o livro de reclamações, cum caneco!',
            },
            {
                termo: 'Que tourada',
                definicao: 'Que confusão, que balbúrdia. Toda a gente aos gritos e ninguém se entende.',
                exemplo: 'Armaram uma peixeirada no Pingo Doce, que tourada!',
            },
            {
                termo: 'Que barraca',
                definicao:
                    'Que vergonha, que fiasco. «Fazer barraca» é fazer figura triste em público.',
                exemplo: 'O revisor do comboio dançou o vira na Queima das Fitas, que barraca!',
            },
            {
                termo: 'Valha-me Deus',
                definicao:
                    'Pedido de socorro ao céu, normalmente pela voz de uma avó a ver o telejornal.',
                exemplo: 'O papagaio foi à manif, valha-me Deus!',
            },
            {
                termo: 'É obra',
                definicao:
                    'Admiração por um feito, seja ele grande ou só ridículo. Muitas vezes é as duas coisas.',
                exemplo: 'Tirou senha e esperou três horas, é obra!',
            },
            {
                termo: 'Granda maluco',
                definicao:
                    'Elogio carinhoso a quem fez uma coisa sem pés nem cabeça. Diz-se a rir.',
                exemplo: 'Foi à praia em janeiro, granda maluco!',
            },
        ],
    },
    {
        id: 'calao',
        titulo: 'Calão do dia a dia',
        entradas: [
            {
                termo: 'Bué',
                definicao:
                    'Muito. Bué de gente, bué de fixe, bué da rápido. Diz-se que chegou via Angola e nunca mais saiu.',
                exemplo: 'O gajo dos balões fugiu bué da rápido.',
            },
            {
                termo: 'Ganda / granda',
                procura: 'ganda',
                definicao: '«Grande», gasto pelo uso. Ganda lata, granda maluco, ganda tralho.',
                exemplo: 'O emigrante entrou na festa com uma ganda lata.',
            },
            {
                termo: 'Tralho',
                definicao: 'Queda aparatosa, das que fazem o café inteiro virar a cabeça. Dá-se um tralho.',
                exemplo: 'O segurança da discoteca deu um ganda tralho na calçada.',
            },
            {
                termo: 'Lata',
                procura: 'ganda lata',
                definicao: 'Descaramento. Quem tem lata come o último pastel de nata e ainda pergunta se há mais.',
                exemplo: 'Pediu desconto na bifana com uma ganda lata.',
            },
            {
                termo: 'Pica',
                procura: 'pica do caraças',
                definicao:
                    'Energia, entusiasmo, vontade. «Do caraças» é um intensificador que não convém traduzir.',
                exemplo: 'Foi para o ginásio com uma pica do caraças.',
            },
            {
                termo: 'Chanfrado',
                definicao: 'Meio maluco, com um parafuso a menos. Pode ser elogio ou diagnóstico.',
                exemplo: 'O vizinho, chanfrado como sempre, foi ao fado de pijama.',
            },
            {
                termo: 'Marado',
                definicao:
                    'Maluco, ou então avariado: há pessoas maradas e máquinas de café maradas.',
                exemplo: 'O taxista, marado, foi à feira em contramão.',
            },
            {
                termo: 'Bacano',
                definicao: 'Boa pessoa, porreiro. Também se diz de coisas: «um sítio bacano».',
                exemplo: 'O arrumador, bacano, guardou o lugar à sogra.',
            },
            {
                termo: 'Porreiro',
                definicao: 'Ótimo, simpático, sem problemas. O «fixe» da geração anterior.',
                exemplo: 'Correu tudo porreiro até chegar a conta.',
            },
            {
                termo: 'Fixe',
                definicao: 'Bom, giro, agradável. A palavra mais útil do português de Portugal.',
                exemplo: 'O concerto foi fixe, mas a bifana foi melhor.',
            },
            {
                termo: 'À rasca',
                definicao:
                    'Em apuros. Pode ser falta de dinheiro, de tempo ou de casa de banho por perto.',
                exemplo: 'O Quim Barreiros, à rasca, perdeu o passe na Queima das Fitas.',
            },
            {
                termo: 'Gingão',
                definicao:
                    'Quem anda a bambolear-se, cheio de si, como se a rua fosse uma passerelle.',
                exemplo: 'O Primeiro-Ministro, todo gingão, pediu uma bifana em Alfama.',
            },
        ],
    },
    {
        id: 'expressoes',
        titulo: 'Expressões feitas',
        entradas: [
            {
                termo: 'À socapa',
                definicao: 'Às escondidas, sem ninguém dar por isso. Ou assim pensava.',
                exemplo: 'Comeu o último pastel de nata à socapa.',
            },
            {
                termo: 'À pala de',
                procura: 'à pala',
                definicao: 'À custa de outra pessoa. Quem vai à pala não paga.',
                exemplo: 'Bebeu uma bica escaldada à pala do cunhado.',
            },
            {
                termo: 'Às três pancadas',
                definicao: 'Feito à pressa e mal, para despachar. O contrário de «com brio».',
                exemplo: 'Montou o móvel do IKEA às três pancadas.',
            },
            {
                termo: 'Baldas',
                definicao:
                    'Quem foge às obrigações. Baldar-se às aulas é faltar sem razão; «em modo baldas» é o resto da semana.',
                exemplo: 'Foi trabalhar em modo baldas.',
            },
            {
                termo: 'Bitaites',
                definicao: 'Palpites que ninguém pediu, dados com toda a confiança.',
                exemplo: 'O treinador de bancada mandou bitaites sobre a bola.',
            },
            {
                termo: 'Seca',
                definicao:
                    'Coisa aborrecida ou espera interminável. Apanha-se uma seca na fila, numa reunião ou num jantar de família.',
                exemplo: 'Apanhou uma seca no autocarro da Carris.',
            },
            {
                termo: 'Peixeirada',
                definicao: 'Discussão aos gritos, à maneira das antigas peixeiras no mercado.',
                exemplo: 'A funcionária das Finanças armou uma peixeirada.',
            },
            {
                termo: 'Mandar vir',
                procura: 'mandou vir',
                definicao:
                    'Tem dois sentidos: pedir alguma coisa («mandou vir um bitoque») ou refilar com alguém («mandou vir com o árbitro»). O contexto decide.',
                exemplo: 'Mandou vir com o árbitro e depois mandou vir um bitoque.',
            },
            {
                termo: 'À grande e à francesa',
                definicao:
                    'Com luxo e sem olhar a gastos. Diz-se que vem dos generais franceses das Invasões, que viviam em Lisboa à grande.',
                exemplo: 'Festejou os anos à grande e à francesa.',
            },
            {
                termo: 'Sem dizer água vai',
                definicao:
                    'Sem avisar. Na Lisboa antiga, quem despejava o balde pela janela gritava «água vai!» primeiro. Às vezes.',
                exemplo: 'O patrão, sem dizer água vai, foi para o Algarve.',
            },
            {
                termo: 'Partir a loiça toda',
                procura: 'partiu a loiça toda',
                definicao: 'Arrasar, deixar toda a gente de boca aberta. Não envolve pratos.',
                exemplo: 'A minha vizinha partiu a loiça toda no karaoke.',
            },
            {
                termo: 'Ficar a ver navios',
                procura: 'ficou a ver navios',
                definicao:
                    'Ficar sem nada, à espera de uma coisa que nunca chega. Diz-se que vem de quem esperava no cais pelo regresso de D. Sebastião.',
                exemplo: 'Chegou atrasado ao jantar e ficou a ver navios.',
            },
            {
                termo: 'De mãos a abanar',
                definicao: 'Sem nada, nem sequer uma garrafa de vinho para o anfitrião.',
                exemplo: 'Apareceu no batizado de mãos a abanar.',
            },
            {
                termo: 'Na desportiva',
                definicao: 'Sem levar a mal, com boa disposição. O contrário de fazer barraca.',
                exemplo: 'Perdeu a carteira, mas levou a coisa na desportiva.',
            },
        ],
    },
    {
        id: 'personagens',
        titulo: 'Personagens e lugares',
        entradas: [
            {
                termo: 'Zé Povinho',
                definicao:
                    'O português comum, criado em 1875 pelo caricaturista Rafael Bordalo Pinheiro. Paga tudo, queixa-se de tudo e responde aos poderosos com um manguito.',
                exemplo: 'O Zé Povinho reclamou do preço da gasolina.',
            },
            {
                termo: 'Tia de Cascais',
                definicao:
                    'Senhora da linha de Cascais, com sotaque de boas famílias, pérolas e opiniões sobre tudo. Não precisa de ser tia de ninguém.',
                exemplo: 'A Tia de Cascais foi à feira e achou tudo «muito giro».',
            },
            {
                termo: "Emigrante 'avec'",
                procura: "emigrante 'avec'",
                definicao:
                    'O emigrante em França que volta em agosto com o carro carregado e mistura as duas línguas: «vou avec a minha femme».',
                exemplo: "O emigrante 'avec' parou o carro no meio da festa da aldeia.",
            },
            {
                termo: 'Leiria (que não existe)',
                definicao:
                    'Piada da internet portuguesa segundo a qual Leiria não existe. Os leirienses discordam, o que é exatamente o que alguém que não existe diria.',
                exemplo: 'Foi ao dentista em Leiria (que não existe).',
            },
            {
                termo: 'Pimba',
                definicao:
                    'Música popular de arraial, com acordeão e letras de duplo sentido que toda a gente canta e ninguém admite saber.',
                exemplo: 'Passou a viagem toda a trautear pimba.',
            },
        ],
    },
    {
        id: 'a-mesa',
        titulo: 'À mesa',
        entradas: [
            {
                termo: 'Bica',
                definicao:
                    'Café expresso, em Lisboa. No Porto pede-se um cimbalino; noutros sítios, só «um café».',
                exemplo: 'Bebeu uma bica escaldada na festa da aldeia.',
            },
            {
                termo: 'Imperial',
                definicao: 'Cerveja de pressão em copo pequeno, no Sul. No Norte chama-se fino.',
                exemplo: 'Assistiu ao jogo com uma imperial na mão.',
            },
            {
                termo: 'Bifana',
                definicao:
                    'Pão com febra de porco marinada em alho e vinho. Come-se de pé, ao balcão, com mostarda.',
                exemplo: 'Pediu uma bifana com mostarda.',
            },
            {
                termo: 'Bitoque',
                definicao:
                    'Bife pequeno com um ovo estrelado por cima, batatas fritas e arroz. O almoço de quem não quer ler a ementa.',
                exemplo: 'Mandou vir um bitoque.',
            },
            {
                termo: 'Francesinha',
                definicao:
                    'Sanduíche do Porto com carnes, coberta de queijo derretido e afogada num molho de cerveja picante. Não tem nada de francês nem de pequeno.',
                exemplo: 'Comeu uma francesinha e foi dormir a sesta.',
            },
            {
                termo: 'Ginjinha',
                definicao: 'Licor de ginja, servido num copinho, às vezes com a ginja lá dentro.',
                exemplo: 'Bebeu uma ginjinha no Rossio.',
            },
            {
                termo: 'Bagaço',
                definicao: 'Aguardente de bagaço de uva. Desinfeta, aquece e tira o juízo.',
                exemplo: 'Bebeu um bagaço para ajudar a digestão.',
            },
            {
                termo: 'Tremoços',
                definicao:
                    'Sementes de tremoço em salmoura, o petisco que acompanha a imperial. Tira-se a pele com os dentes.',
                exemplo: 'Viu o Benfica enquanto comia tremoços.',
            },
            {
                termo: 'Caracóis',
                definicao:
                    'Petisco de verão, cozido com orégãos. Quando aparece o cartaz «Há caracóis», começou o verão.',
                exemplo: 'Foi aos caracóis depois do trabalho.',
            },
            {
                termo: 'Farturas',
                definicao: 'Massa frita polvilhada com açúcar e canela, vendida em rulotes nas feiras.',
                exemplo: 'Desapareceu na rulote das farturas.',
            },
        ],
    },
];

/** Stable anchor for a term, so /dicionario#carago can be linked directly. */
export function ancora(termo: string): string {
    return termo
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
}
