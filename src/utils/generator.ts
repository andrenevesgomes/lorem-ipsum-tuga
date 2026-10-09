import { dictionary, type GeneratorOptions } from '../data/dictionary.js';
import { atualidade } from '../data/atualidade.js';

interface WorkingDictionary {
    intros: string[];
    subjects: string[];
    actions: string[];
    cheekyActions: string[];
    complements: string[];
    connectors: string[];
    endings: string[];
    slang: string[];
    slangAdjectives: string[];
}

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
        const paragraphs: string[] = [];
        for (let i = 0; i < numParagraphs; i++) {
            paragraphs.push(this.createParagraph(intensity, options, rng));
        }
        return paragraphs;
    }

    // Build a fresh, filtered word bank. "people" and general actions/complements are
    // always present so the generator never runs out of words, whatever the options.
    private buildBank(options: GeneratorOptions): WorkingDictionary {
        return {
            intros: options.expressions ? [...dictionary.intros, ...atualidade.intros] : [],
            subjects: [
                ...dictionary.people,
                ...(options.celebrities ? dictionary.celebrities : []),
            ],
            actions: [
                ...dictionary.actions,
                ...atualidade.actions,
                ...(options.food ? dictionary.foodActions : []),
            ],
            cheekyActions: [...dictionary.cheekyActions],
            complements: [
                ...dictionary.complements,
                ...atualidade.complements,
                ...(options.food ? dictionary.foodComplements : []),
            ],
            connectors: [...dictionary.connectors],
            endings: options.expressions ? [...dictionary.endings, ...atualidade.endings] : [],
            slang: options.expressions ? [...dictionary.slang] : [],
            slangAdjectives: options.expressions ? [...dictionary.slangAdjectives] : [],
        };
    }

    private createParagraph(intensity: number, options: GeneratorOptions, rng: Rng): string {
        const numSentences = Math.floor(rng() * 4) + 3; // 3 to 6 sentences

        // Fresh bank per paragraph so getRandomAndRemove dedupes within the paragraph.
        const tempData = this.buildBank(options);

        let paragraph = "";
        for (let i = 0; i < numSentences; i++) {
            paragraph += this.createSentence(intensity, tempData, rng) + " ";
        }

        return paragraph.trim();
    }

    private createSentence(intensity: number, tempData: WorkingDictionary, rng: Rng): string {
        const isComplex = rng() > 0.5;
        const useSlang = (intensity / 100) > rng();
        
        let sentence = "";
        
        // 1. Intro (only when expressions are enabled and available)
        if (tempData.intros.length > 0 && rng() > 0.3) {
            sentence += this.getRandomAndRemove(tempData.intros, rng) + " ";
        }

        // 2. Core Sentence
        sentence += this.buildCoreSentence(useSlang, tempData, rng);

        // 3. Connector + Second part
        if (isComplex) {
            sentence += " " + this.getRandomAndRemove(tempData.connectors, rng) + " " + this.buildCoreSentence(useSlang, tempData, rng);
        }

        // 4. Ending (fall back to a full stop when no expressive endings are available)
        if (tempData.endings.length > 0 && rng() < (intensity / 100)) {
            sentence += this.getRandomAndRemove(tempData.endings, rng);
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

    private buildCoreSentence(useSlang: boolean, tempData: WorkingDictionary, rng: Rng): string {
        const subject = this.getRandomAndRemove(tempData.subjects, rng);
        let s = subject;

        if (useSlang && rng() > 0.5) {
            if (tempData.slangAdjectives.length > 0 && rng() < 0.5) {
                s += " " + agree(this.getRandomAndRemove(tempData.slangAdjectives, rng), subject);
            } else if (tempData.slang.length > 0) {
                s += ", " + this.getRandomAndRemove(tempData.slang, rng) + ",";
            }
        }

        const actionPools = CELEBRITIES.has(subject)
            ? [tempData.actions]
            : [tempData.actions, tempData.cheekyActions];
        s += " " + this.pickFromPools(actionPools, rng);
        s += " " + this.getRandomAndRemove(tempData.complements, rng);
        
        return s;
    }

    // Uniform pick across several lists, removing the chosen item from its list.
    private pickFromPools(pools: string[][], rng: Rng): string {
        let index = Math.floor(rng() * pools.reduce((sum, pool) => sum + pool.length, 0));
        for (const pool of pools) {
            if (index < pool.length) return pool.splice(index, 1)[0];
            index -= pool.length;
        }
        return "";
    }

    private getRandomAndRemove(arr: string[], rng: Rng): string {
        if (!arr || arr.length === 0) {
            return ""; 
        }
        const index = Math.floor(rng() * arr.length);
        const item = arr[index];
        arr.splice(index, 1); // Remove used item
        return item;
    }
}

export const generator = new TugaGenerator();
