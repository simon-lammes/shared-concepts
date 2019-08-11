export enum ExerciseType {
    TERM_PROMPT
}

export interface Exercise {
    type: ExerciseType;
    front: string;
    possibleTerms: string[];
    explanation?: string;
}
