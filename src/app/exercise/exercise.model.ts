export interface Exercise {
    type: string;
    front: string;
    possibleTerms?: string[];
    explanation?: string;
    correctResponses?: string[];
    wrongResponses?: string[];
}

export class ExerciseTypes {
    public static TERM_PROMPT = 'TERM_PROMPT';
    public static MULTIPLE_RESPONSE_QUESTION = 'MULTIPLE_RESPONSE_QUESTION';
    public static ALL_TYPES = [
        ExerciseTypes.TERM_PROMPT,
        ExerciseTypes.MULTIPLE_RESPONSE_QUESTION
    ];
}
