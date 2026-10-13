import { dictionary, type GeneratorOptions } from '../data/dictionary.js';
import { atualidade } from '../data/atualidade.js';

interface WorkingDictionary {
    intros: Bag;
    subjects: Bag;
    actions: Bag;
    cheekyActions: Bag;
    complements: Bag;
    connectors: Bag;
    endings: Bag;
    slang: Bag;
    slangAdjectives: Bag;
}

// Hands out every item once before repeating any, so long texts never run dry.
class Bag {
    private left: string[] = [];
    constructor(private readonly source: string[]) {}

    get isEmpty(): boolean {
        return this.source.length === 0;
    }

    items(): string[] {
        if (this.left.length === 0) this.left = [...this.source];
        return this.left;
    }
}

// Words too common to count as a repeated theme.
const COMMON = new Set(['outra', 'minha', 'porque', 'depois', 'ainda', 'sobre', 'entre', 'quando', 'mesmo', 'muito', 'horas', 'euros']);

// "no debate do Orçamento" -> ["debate", "orçamento"]: the words a reader would notice twice.
function keyWords(phrase: string): string[] {
    return (phrase.toLowerCase().match(/\p{L}{5,}/gu) ?? []).filter((w) => !COMMON.has(w));
}

// Draws per pick before settling for a phrase that repeats a theme.
const ATTEMPTS = 6;

const DEFAULT_OPTIONS: GeneratorOptions = {
    celebrities: true,
    expressions: true,
    food: true,
};

type Rng = () => number;

const CELEBRITIES = new Set(dictionary.celebrities);

// "chanfrado|chanfrada": pick the form that agrees with the subject's article.
function agree(adjective: string, subject: string): string {
    const [masculine, feminine = masculine] = adjective.split('|');
    return /^(a|uma) /.test(subject) ? feminine : masculine;
}

// Small, fast, seedable PRNG. Same seed => same sequence, so a generated text can be
// reproduced from a shareable link.
function mulberry32(seed: number): Rng {
    let a = seed >>> 0;
    return () => {
        a |= 0;
        a = (a + 0x6D2B79F5) | 0;
        let t = Math.imul(a ^ (a >>> 15), 1 | a);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

export class TugaGenerator {
    generate(
        numParagraphs: number,
        intensity: number,
        options: GeneratorOptions = DEFAULT_OPTIONS,
        seed?: number,
    ): string[] {
        const rng: Rng = seed === undefined ? Math.random : mulberry32(seed);
        // One bank for the whole text, so a phrase doesn't come back in the next paragraph.
        const bank = this.buildBank(options);
        const used = new Set<string>();
        const paragraphs: string[] = [];
        for (let i = 0; i < numParagraphs; i++) {
            paragraphs.push(this.createParagraph(intensity, bank, used, rng));
        }
        return paragraphs;
    }

    // "people" and general actions/complements are always present so the generator
    // never runs out of words, whatever the options.
    private buildBank(options: GeneratorOptions): WorkingDictionary {
        return {
            intros: new Bag(options.expressions ? [...dictionary.intros, ...atualidade.intros] : []),
            subjects: new Bag([
                ...dictionary.people,
                ...(options.celebrities ? dictionary.celebrities : []),
            ]),
            actions: new Bag([
                ...dictionary.actions,
                ...atualidade.actions,
                ...(options.food ? dictionary.foodActions : []),
            ]),
            cheekyActions: new Bag(dictionary.cheekyActions),
            complements: new Bag([
                ...dictionary.complements,
                ...atualidade.complements,
                ...(options.food ? dictionary.foodComplements : []),
            ]),
            connectors: new Bag(dictionary.connectors),
            endings: new Bag(options.expressions ? [...dictionary.endings, ...atualidade.endings] : []),
            slang: new Bag(options.expressions ? dictionary.slang : []),
            slangAdjectives: new Bag(options.expressions ? dictionary.slangAdjectives : []),
        };
    }

    private createParagraph(intensity: number, bank: WorkingDictionary, used: Set<string>, rng: Rng): string {
        const numSentences = Math.floor(rng() * 4) + 3; // 3 to 6 sentences

        let paragraph = "";
        for (let i = 0; i < numSentences; i++) {
            paragraph += this.createSentence(intensity, bank, used, rng) + " ";
        }

        return paragraph.trim();
    }

    private createSentence(intensity: number, bank: WorkingDictionary, used: Set<string>, rng: Rng): string {
        const isComplex = rng() > 0.5;
        const useSlang = (intensity / 100) > rng();
        
        let sentence = "";
        
        // 1. Intro (only when expressions are enabled and available)
        if (!bank.intros.isEmpty && rng() > 0.3) {
            sentence += this.pick([bank.intros], used, rng) + " ";
        }

        // 2. Core Sentence
        sentence += this.buildCoreSentence(useSlang, bank, used, rng);

        // 3. Connector + Second part
        if (isComplex) {
            sentence += " " + this.pick([bank.connectors], used, rng) + " " + this.buildCoreSentence(useSlang, bank, used, rng);
        }

        // 4. Ending (fall back to a full stop when no expressive endings are available)
        if (!bank.endings.isEmpty && rng() < (intensity / 100)) {
            sentence += this.pick([bank.endings], used, rng);
        } else {
            sentence += ".";
        }

        // Trim any leading space (e.g. when the intro was skipped) and capitalize,
        // including right after a question intro ("Sabes que mais? O Toy...").
        sentence = sentence.trimStart();
        sentence = sentence.charAt(0).toUpperCase() + sentence.slice(1);
        sentence = sentence.replace(/\? (\p{Ll})/u, (_, c: string) => "? " + c.toUpperCase());
        
        return sentence;
    }

    private buildCoreSentence(useSlang: boolean, bank: WorkingDictionary, used: Set<string>, rng: Rng): string {
        const subject = this.pick([bank.subjects], used, rng);
        let s = subject;

        if (useSlang && rng() > 0.5) {
            if (!bank.slangAdjectives.isEmpty && rng() < 0.5) {
                s += " " + agree(this.pick([bank.slangAdjectives], used, rng), subject);
            } else if (!bank.slang.isEmpty) {
                s += ", " + this.pick([bank.slang], used, rng) + ",";
            }
        }

        const actionBags = CELEBRITIES.has(subject)
            ? [bank.actions]
            : [bank.actions, bank.cheekyActions];
        s += " " + this.pick(actionBags, used, rng);
        s += " " + this.pick([bank.complements], used, rng);
        
        return s;
    }

    // Uniform pick across bags, preferring a phrase whose key words haven't appeared yet.
    private pick(bags: Bag[], used: Set<string>, rng: Rng): string {
        const pools = bags.filter((bag) => !bag.isEmpty).map((bag) => bag.items());
        const total = pools.reduce((sum, pool) => sum + pool.length, 0);
        if (total === 0) return "";

        let pool = pools[0];
        let index = 0;
        for (let attempt = 0; attempt < ATTEMPTS; attempt++) {
            let i = Math.floor(rng() * total);
            let p = 0;
            while (i >= pools[p].length) i -= pools[p++].length;
            pool = pools[p];
            index = i;
            if (!keyWords(pool[index]).some((w) => used.has(w))) break;
        }

        const item = pool.splice(index, 1)[0];
        for (const w of keyWords(item)) used.add(w);
        return item;
    }
}

export const generator = new TugaGenerator();
