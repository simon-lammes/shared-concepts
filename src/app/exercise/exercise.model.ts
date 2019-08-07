export enum ExcerciseType {
    TERM_PROMPT
}

export interface Exercise {
        type: ExcerciseType;
        front: string;
        possibleTerms: string[];
}
