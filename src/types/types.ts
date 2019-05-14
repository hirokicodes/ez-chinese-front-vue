export namespace Types {
  export interface Me {
    id: String;
    username: String;
    email: String;
    flashcards: Flashcard[];
  }

  export interface Hanzi {
    id: string;
    simplified: string;
    traditional: string;
    definitions: string;
    definitionsDiacritic: string;
    pinyinDiacritic: string;
    pinyinNumeric: string;
    referencedSimplified: string | null;
    referencedTraditional: string | null;
  }

  export interface Flashcard {
    id: string;
    hanzi: Hanzi;
    comfortLevel: number;
    updatedAt: string;
    createdAt: string;
  }
}
