export enum ExcerciseType {
    TERM_PROMPT
}

export class Exercise {
    constructor(
        public type: ExcerciseType,
        public question: string,
        public possibleTerms: string[]
    ){}
}