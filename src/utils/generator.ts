import { dictionary, GeneratorOptions } from '../data/dictionary';

interface WorkingDictionary {
    intros: string[];
    subjects: string[];
    actions: string[];
    complements: string[];
    connectors: string[];
    endings: string[];
    slang: string[];
}

const DEFAULT_OPTIONS: GeneratorOptions = {
    celebrities: true,
    expressions: true,
    food: true,
};

type Rng = () => number;

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
            intros: options.expressions ? [...dictionary.intros] : [],
            subjects: [
                ...dictionary.people,
                ...(options.celebrities ? dictionary.celebrities : []),
            ],
            actions: [
                ...dictionary.actions,
                ...(options.food ? dictionary.foodActions : []),
            ],
            complements: [
                ...dictionary.complements,
                ...(options.food ? dictionary.foodComplements : []),
            ],
            connectors: [...dictionary.connectors],
            endings: options.expressions ? [...dictionary.endings] : [],
            slang: options.expressions ? [...dictionary.slang] : [],
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

        // Trim any leading space (e.g. when the intro was skipped) and capitalize.
        sentence = sentence.trimStart();
        sentence = sentence.charAt(0).toUpperCase() + sentence.slice(1);
        
        return sentence;
    }

    private buildCoreSentence(useSlang: boolean, tempData: WorkingDictionary, rng: Rng): string {
        let s = this.getRandomAndRemove(tempData.subjects, rng) + " ";
        
        if (useSlang && tempData.slang.length > 0 && rng() > 0.5) {
            s += this.getRandomAndRemove(tempData.slang, rng) + " "; 
        }
        
        s += this.getRandomAndRemove(tempData.actions, rng) + " ";
        s += this.getRandomAndRemove(tempData.complements, rng);
        
        return s;
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
