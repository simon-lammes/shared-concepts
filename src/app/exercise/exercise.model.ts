export interface Exercise {
    type: string;
    front: string;
    possibleTerms?: string[];
    explanation?: string;
}

export class ExerciseTypes {
    public static TERM_PROMPT = 'TERM_PROMPT';
    public static ALL_TYPES = [
        ExerciseTypes.TERM_PROMPT
    ];
}
