export enum ExcerciseType {
    TERM_PROMPT
}

export class Exercise {
    constructor(
        public type: ExcerciseType,
        public front: string,
        public possibleTerms: string[]
    ){}
}