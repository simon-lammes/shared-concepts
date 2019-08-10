export interface SharedConceptSettings {
    cooldownTime: TimeSpan;
}

export class TimeSpan {
    constructor(
        public days: number,
        public hours: number,
        public minutes: number
    ) {
    }
}
