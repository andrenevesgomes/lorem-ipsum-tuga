export interface Dictionary {
    intros: string[];
    people: string[];
    celebrities: string[];
    actions: string[];
    foodActions: string[];
    complements: string[];
    foodComplements: string[];
    connectors: string[];
    endings: string[];
    slang: string[];
}

export interface GeneratorOptions {
    celebrities: boolean;
    expressions: boolean;
    food: boolean;
}

export const dictionary: Dictionary = {
    intros: [
        "Eh pá,", "Ouve lá,", "Diz-me uma coisa,", "Atenção que", "Por acaso,", "Imagina,", "Vê lá se,", 
        "Então,", "Mas olha que,", "Portanto,", "Basicamente,", "Sinceramente,", "Epá,", "Ó homem,",
        "Olha que não sei se,", "A verdade é que,", "No outro dia,", "Sabes que mais?", "E digo-te mais,",
        "Agora a sério,", "Deixa-me dizer-te,", "Ouve o que te digo,", "Pois é,", "Curiosamente,",
        "Ainda por cima,", "E não é que,", "Vê bem,", "Repara nisto,", "Mano,", "Oh filho,", "Ó chefe,",
        "Escuta lá,", "Vá lá, sê sincero,", "Olha que a vida não custa nada,", "É assim,", "Ora bem,",
        "Digo-te uma coisa,", "Imagina só tu,", "Oh pá, cala-te,", "Não vais acreditar,", "Vou-te contar uma,"
    ],
    // Generic folk, jobs and characters — always available so the generator never runs dry.
    people: [
        "o Zé do Pipo", "uma alheira", "a minha vizinha", "o emplastro", "o taxista", "o gajo do talho",
        "o meu primo da Suíça", "o fiscal das finanças", "o carteiro", "a peixeira", "o trolha",
        "o estagiário", "o patrão", "o árbitro", "o treinador de bancada", "o Zé Povinho",
        "a padeira de Aljubarrota", "o Camões", "o D. Afonso Henriques", "o Presidente da Junta",
        "o homem do lixo", "a senhora do café", "o meu avô", "o cão do vizinho", "o gato da vizinha",
        "o papagaio", "o periquito", "a Tia de Cascais", "o guna da Areosa", "o Primeiro-Ministro",
        "o revisor do comboio", "a funcionária das Finanças", "o gajo dos balões", "o emplastro (outra vez)",
        "o homem da buzina", "o arrumador de carros", "o turista de sandálias", "o condutor de domingo",
        "a influencer do Instagram", "o emigrante 'avec'", "o segurança da discoteca",
        "o carteiro que toca e foge"
    ],
    // Named public figures — only used when "Figuras Públicas" is on.
    celebrities: [
        "o Cristiano Ronaldo", "a Cristina Ferreira", "o Gato Fedorento", "o Fernando Mendes", "o Toy",
        "o Jorge Jesus", "o Marcelo", "o Quim Barreiros", "o Herman José", "o Ljubomir Stanisic",
        "o Quaresma", "a Cinha Jardim"
    ],
    actions: [
        "partiu a loiça toda", "ficou a ver navios", 
        "foi comprar tabaco", "perdeu a carteira", "ganhou o Euromilhões", "foi à bola", 
        "apanhou uma bebedeira", "foi ao Santuário", "apanhou o elétrico 28",
        "foi ver o Benfica", "foi ver o Sporting", "foi ver o Porto", "armou uma peixeirada",
        "foi à feira", "foi ao fado",
        "apanhou uma seca", "deu um ganda tralho", "foi apanhar sol", "foi à praia",
        "foi ao shopping", "foi ao cinema", "foi ao teatro", "foi ao concerto", "foi ao festival",
        "foi à discoteca", "foi ao bar", "foi ao restaurante", "foi ao café", "foi à pastelaria",
        "foi à padaria", "foi à mercearia", "foi ao talho", "foi à peixaria", "foi à farmácia",
        "foi ao médico", "foi ao dentista", "foi ao hospital", "foi ao centro de saúde",
        "ficou preso no IC19", "reclamou do preço da gasolina", "foi ao Big Brother", 
        "insultou o trânsito", "apanhou uma multa", "tentou fugir ao fisco", 
        "foi às compras ao chinês", 
        "meteu 20 euros de gasolina", "disse que ia pagar mas esqueceu-se", "foi ver as montras",
        "adormeceu na praia", "perdeu o passe", "apanhou o Fertagus",
        "discutiu com a sogra", "foi à manif", "mandou vir com o árbitro"
    ],
    // Food & drink actions — only used when "Comida" is on.
    foodActions: [
        "foi aos caracóis", "mandou vir um bitoque", "comeu uma francesinha", "comprou um pastel de nata",
        "bebeu uma ginjinha", "comeu um pastel de bacalhau", "bebeu um bagaço", "queimou o assado"
    ],
    complements: [
        "no Chiado", "com o Fernando Mendes", "antes do telejornal", "na casa da vizinha", 
        "no Pingo Doce", "na tasca do Zé", "em Leiria (que não existe)", "no Algarve", 
        "na ponte 25 de Abril", "no meio do trânsito", "na fila da segurança social",
        "a ouvir Xutos",
        "na Segunda Circular", "no Marquês de Pombal", "na Torre de Belém", "nos Jerónimos",
        "na Ribeira", "na Baixa", "no Rossio", "no Bairro Alto", "em Alfama", "na Mouraria",
        "em Sintra", "em Cascais", "no Estoril", "na Caparica", "na Arrábida", "no Gerês",
        "na Serra da Estrela", "no Douro", "no Alentejo", "na Madeira", "nos Açores",
        "no metro", "no autocarro", "no comboio", "no barco", "no avião", "no táxi", "no uber",
        "no IKEA de Alfragide", "na fila da Primark", "nos Santos Populares", 
        "na festa da aldeia", "na Queima das Fitas", "no Cais do Sodré", 
        "na rotunda do Marquês", "numa esplanada à beira-mar", "no tasco do Manel", 
        "na Loja do Cidadão", "no autocarro da Carris", "a ouvir pimba",
        "com o bilhete na mão", "à porta da Zara",
        "no parque de campismo", "no Santuário de Fátima"
    ],
    // Food & drink complements — only used when "Comida" is on.
    foodComplements: [
        "enquanto comia tremoços", "com uma imperial na mão", "na fila para o brunch",
        "na rulote das farturas"
    ],
    connectors: [
        "e depois", "mas de repente", "porque", "visto que", "só que", "entretanto", "por isso é que",
        "e nisto", "e do nada", "mas atenção,", "e então", "e por causa disso", "e logo a seguir",
        "e mais tarde", "e no fim", "e no entanto", "e contudo", "e todavia", "e porém",
        "e além disso", "e ainda", "e também", "e igualmente", "e da mesma forma", "e assim",
        "e deste modo", "e consequentemente", "e por conseguinte", "e portanto", "e logo",
        "e o pior é que", "e para cúmulo", "e lá ver", "e às tantas", "e nisto tudo", 
        "e sabes o que aconteceu?", "e por incrível que pareça", "e sem querer",
        "e na volta", "e vai daí", "e pumba", "e catrapum"
    ],
    endings: [
        ", tás a ver?", ", hã?", ", carago!", ", pá!", ", mai nada!", ", espetáculo!", 
        ", percebes?", ", né?", ", ouviste?", ", granda maluco!", ", que cena!", ", fónix!",
        ", não achas?", ", diz lá!", ", a sério!", ", juro!", ", palavra de honra!",
        ", acredita!", ", confia!", ", top!", ", brutal!", ", lindo!", ", maravilha!",
        ", que luxo!", ", que classe!", ", que nível!", ", que categoria!", ", que estilo!",
        ", tás a perceber a jogada?", ", que tourada!", ", lindo menino!", ", ai mãe!", 
        ", valha-me Deus!", ", cum caneco!", ", impecável!", ", é obra!", ", estás lá!",
        ", granda narsa!", ", que barraca!", ", nunca vi nada assim!", ", é o que é!"
    ],
    slang: [
        "bué da", "ganda", "tipo", "cena", "tuga", "fixe", "tótil", "top", "brutal", "marado", "chanfrado",
        "giro", "porreiro", "bacano", "mó", "chunga", "beto", "mitra", "gunão",
        "sossio", "primaço", "moca", "pica", "dred", "chavalo", "jarda", "estrilho",
        "manso", "cota", "chavalada", "ya", "nicles", "baldas", "fino"
    ]
};
