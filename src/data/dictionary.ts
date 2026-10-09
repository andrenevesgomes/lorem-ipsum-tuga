export interface Dictionary {
    intros: string[];
    people: string[];
    celebrities: string[];
    actions: string[];
    // Mild wrongdoing (fines, the taxman, hangovers): never paired with real public figures.
    cheekyActions: string[];
    foodActions: string[];
    complements: string[];
    foodComplements: string[];
    connectors: string[];
    endings: string[];
    slang: string[];
    // "masculino|feminino" (or one invariant form), glued right after the subject.
    slangAdjectives: string[];
}

export interface GeneratorOptions {
    celebrities: boolean;
    expressions: boolean;
    food: boolean;
}

export const dictionary: Dictionary = {
    intros: [
        "Eh pá,", "Ouve lá,", "Diz-me uma coisa,", "Atenção que", "Por acaso,", "Imagina,", "Vê lá tu,",
        "Então,", "Mas olha,", "Portanto,", "Basicamente,", "Sinceramente,", "Epá,", "Ó homem,",
        "Não sei se sabes, mas", "A verdade é que", "No outro dia,", "Sabes que mais?", "E digo-te mais,",
        "Agora a sério,", "Deixa-me dizer-te,", "Ouve o que te digo,", "Pois é,", "Curiosamente,",
        "Ainda por cima,", "E não é que", "Vê bem,", "Repara nisto,", "Mano,", "Ó filho,", "Ó chefe,",
        "Escuta lá,", "Olha que a vida não custa nada,", "É assim,", "Ora bem,",
        "Digo-te uma coisa,", "Ó pá, cala-te,", "Não vais acreditar,", "Vou-te contar uma,",
        "Diz que", "Juro-te,", "Segundo a minha tia,", "Conta-se no café que"
    ],
    // Generic folk, jobs and characters — always available so the generator never runs dry.
    people: [
        "o Zé do Pipo", "uma alheira", "a minha vizinha", "o emplastro", "o taxista", "o gajo do talho",
        "o meu primo da Suíça", "o fiscal das finanças", "o carteiro", "a peixeira", "o trolha",
        "o estagiário", "o patrão", "o árbitro", "o treinador de bancada", "o Zé Povinho",
        "a padeira de Aljubarrota", "o Camões", "o D. Afonso Henriques", "o Presidente da Junta",
        "o homem do lixo", "a senhora do café", "o meu avô", "o cão do vizinho", "o gato da vizinha",
        "o papagaio", "o periquito", "a Tia de Cascais", "o vizinho do 3.º esquerdo",
        "o revisor do comboio", "a funcionária das Finanças", "o gajo dos balões", "o emplastro (outra vez)",
        "o homem da buzina", "o arrumador de carros", "o turista de sandálias", "o condutor de domingo",
        "a influencer do Instagram", "o emigrante 'avec'", "o segurança da discoteca",
        "o carteiro que toca e foge"
    ],
    // Named public figures — only used when "Figuras Públicas" is on.
    celebrities: [
        "o Cristiano Ronaldo", "a Cristina Ferreira", "o Gato Fedorento", "o Fernando Mendes", "o Toy",
        "o Jorge Jesus", "o Marcelo", "o Quim Barreiros", "o Herman José", "o Ljubomir Stanisic",
        "o Quaresma", "a Cinha Jardim", "o Primeiro-Ministro"
    ],
    actions: [
        "partiu a loiça toda", "ficou a ver navios", "foi comprar tabaco", "perdeu a carteira",
        "ganhou o Euromilhões", "foi à bola", "foi a Fátima a pé", "apanhou o elétrico 28",
        "foi ver o Benfica", "foi ver o Sporting", "foi ver o Porto", "armou uma peixeirada",
        "foi à feira", "foi ao fado", "apanhou uma seca", "deu um ganda tralho", "foi apanhar sol",
        "foi à praia", "ficou preso no IC19", "reclamou do preço da gasolina", "foi ao Big Brother",
        "insultou o trânsito", "foi às compras ao chinês", "meteu 20 euros de gasolina",
        "foi ver as montras", "adormeceu na praia", "perdeu o passe", "apanhou o Fertagus",
        "discutiu com a sogra", "foi à manif", "mandou vir com o árbitro",
        "pediu o livro de reclamações", "tirou senha e esperou três horas", "ficou a falar do tempo",
        "ligou para a rádio a pedir uma música", "chorou com o hino", "foi buscar o pão às sete da manhã",
        "discutiu o penálti durante três horas", "deixou o pisca ligado", "esqueceu-se do guarda-chuva",
        "dançou o Bailinho da Madeira", "jogou à sueca", "regateou o preço de umas meias",
        "mandou um áudio de sete minutos", "pôs o telemóvel em alta voz", "mandou bitaites sobre a bola",
        "tirou uma selfie com uma gaivota", "jurou a pés juntos que o Diesel é que é bom"
    ],
    cheekyActions: [
        "apanhou uma bebedeira", "tentou fugir ao fisco", "apanhou uma multa",
        "disse que ia pagar mas esqueceu-se", "estacionou em segunda fila", "passou à frente na fila"
    ],
    // Food & drink actions — only used when "Comida" is on.
    foodActions: [
        "foi aos caracóis", "mandou vir um bitoque", "comeu uma francesinha", "comprou um pastel de nata",
        "bebeu uma ginjinha", "comeu um pastel de bacalhau", "bebeu um bagaço", "queimou o assado",
        "pediu uma bifana com mostarda", "bebeu uma bica escaldada", "molhou o pão no molho",
        "comeu sardinhas com a mão"
    ],
    complements: [
        "no Chiado", "com a sogra atrás", "antes do telejornal", "na casa da vizinha", 
        "no Pingo Doce", "na tasca do Zé", "em Leiria (que não existe)", "no Algarve", 
        "na ponte 25 de Abril", "no meio do trânsito", "na fila da segurança social",
        "a ouvir Xutos",
        "na Segunda Circular", "no Marquês de Pombal", "na Torre de Belém", "nos Jerónimos",
        "na Ribeira", "na Baixa", "no Rossio", "no Bairro Alto", "em Alfama", "na Mouraria",
        "em Sintra", "em Cascais", "no Estoril", "na Caparica", "na Arrábida", "no Gerês",
        "na Serra da Estrela", "no Douro", "no Alentejo", "na Madeira", "nos Açores",
        "no metro", "no comboio", "no barco", "no avião", "no táxi", "no uber",
        "no IKEA de Alfragide", "na fila da Primark", "nos Santos Populares", 
        "na festa da aldeia", "na Queima das Fitas", "no Cais do Sodré", 
        "na rotunda do Marquês", "numa esplanada à beira-mar", "no tasco do Manel", 
        "na Loja do Cidadão", "no autocarro da Carris", "a ouvir pimba",
        "com o bilhete na mão", "à porta da Zara",
        "no parque de campismo"
    ],
    // Food & drink complements — only used when "Comida" is on.
    foodComplements: [
        "enquanto comia tremoços", "com uma imperial na mão", "na fila para o brunch",
        "na rulote das farturas", "com um bolo de arroz na mão", "à espera da bifana"
    ],
    connectors: [
        "e depois", "mas de repente", "porque", "visto que", "só que", "entretanto", "por isso é que",
        "e nisto", "e do nada", "mas atenção,", "e então", "e por causa disso", "e logo a seguir",
        "e mais tarde", "e no fim", "e o pior é que", "e para cúmulo", "e vai-se a ver", "e às tantas",
        "e por incrível que pareça", "e sem querer", "e na volta", "e vai daí", "e pumba", "e catrapum",
        "e para ajudar à festa", "e como se não bastasse", "e escusado será dizer que", "e para variar",
        "e, claro está,", "e, surpresa das surpresas,", "e, como é tradição,", "e, pasme-se,"
    ],
    endings: [
        ", tás a ver?", ", hã?", ", carago!", ", pá!", ", mai nada!", ", espetáculo!",
        ", percebes?", ", ou não?", ", ouviste?", ", granda maluco!", ", que cena!", ", fónix!",
        ", não achas?", ", diz lá!", ", a sério!", ", juro!", ", palavra de honra!",
        ", acredita!", ", confia!", ", brutal!", ", maravilha!", ", que luxo!", ", que categoria!",
        ", tás a perceber a jogada?", ", que tourada!", ", lindo menino!", ", ai mãe!",
        ", valha-me Deus!", ", cum caneco!", ", impecável!", ", é obra!", ", estás lá!",
        ", granda narsa!", ", que barraca!", ", nunca vi nada assim!", ", é o que é!",
        ", pronto!", ", é a vida!", ", está tudo dito!",
        ", só que não!", ", Portugal no seu melhor!", ", grande novidade!", ", quem diria!",
        ", ninguém estava à espera!", ", e ainda dizem que somos pessimistas!"
    ],
    // Asides that go between commas right after the subject, so they read right whatever the gender.
    slang: [
        "na maior das calmas", "à grande e à francesa", "sem dizer água vai", "com uma pica do caraças",
        "à socapa", "à pala do cunhado", "na desportiva", "bué da rápido", "com uma ganda lata",
        "com cara de caso", "à tuga", "às três pancadas", "na brincadeira", "de mãos a abanar",
        "à última da hora", "em modo baldas", "num instante", "sem stress nenhum", "a trautear pimba",
        "com o cachecol ao pescoço", "de chinelo no pé", "de fato de treino",
        "tipo", "pá", "com a pontualidade do costume", "com a eficiência habitual",
        "com o entusiasmo de segunda-feira", "como manda a tradição", "sem ninguém pedir"
    ],
    slangAdjectives: [
        "chanfrado|chanfrada", "marado|marada", "bacano|bacana", "porreiro|porreira", "fixe",
        "todo pimpão|toda pimpona", "armado em esperto|armada em esperta", "todo lampeiro|toda lampeira",
        "cheio de pinta|cheia de pinta", "todo janota|toda janota", "todo gingão|toda gingona",
        "com a mania", "à rasca", "armado em turista|armada em turista", "todo contente|toda contente"
    ]
};
