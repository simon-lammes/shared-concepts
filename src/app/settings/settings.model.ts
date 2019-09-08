export interface SharedConceptSettings {
    cooldownTime: TimeSpan;
    disabledExerciseTypes: string[];
    conceptKeysOfDisabledExercises: string[];
    editorMode: boolean;
}

export interface TimeSpan {
    days: number;
    hours: number;
    minutes: number;
}

export function defaultSettings() {
    const cooldownTime: TimeSpan = {
        days: 0,
        hours: 0,
        minutes: 2
    };
    const settings: SharedConceptSettings = {
        cooldownTime,
        conceptKeysOfDisabledExercises: [],
        disabledExerciseTypes: [],
        editorMode: false
    };
    return settings;
}

export function getSecondsFromTimeSpan(timeSpan: TimeSpan) {
    return timeSpan.minutes * 60
        + timeSpan.hours * 60 * 60
        + timeSpan.days * 24 * 60 * 60;
}
