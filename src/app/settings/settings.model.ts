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

    getTotalInSeconds(): number {
        return this.minutes * 60
            + this.hours * 60 * 60
            + this.days * 24 * 60 * 60;
    }
}
