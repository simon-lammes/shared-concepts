import * as firebase from 'firebase/app';
import {getSecondsFromTimeSpan, SharedConceptSettings} from '../settings/settings.model';

const thisVariableOnlyServesThePurposeThatWebStormKnowsThatTheAboveImportIsUsedAndShouldNotBeDeleted = firebase;
import Timestamp = firebase.firestore.Timestamp;

export interface Experience {
    correctStreak: number;
    lastTimeSeen?: Timestamp;
    conceptKey: string;
}

export function getDefaultExperience(conceptKey: string) {
    const experience: Experience = {
        correctStreak: 0,
        conceptKey
    };
    return experience;
}

export interface ExperienceMap {
    [conceptKey: string]: Experience;
}

export function updateExperience(experience: Experience, answeredCorrectly: boolean) {
    if (answeredCorrectly) {
        updateExperienceBecauseForUserAnsweredCorrectly(experience);
    } else {
        updateExperienceBecauseForUserAnsweredFalsely(experience);
    }
}

export function updateExperienceBecauseForUserAnsweredCorrectly(experience: Experience) {
    if (experience.correctStreak <= 0) {
        experience.correctStreak = 1;
    } else {
        experience.correctStreak += 1;
    }
    experience.lastTimeSeen = Timestamp.now();
}

export function updateExperienceBecauseForUserAnsweredFalsely(experience: Experience) {
    if (experience.correctStreak >= 0) {
        experience.correctStreak = -1;
    } else {
        experience.correctStreak -= 1;
    }
    experience.lastTimeSeen = Timestamp.now();
}

export function exerciseCooldownOverAndExerciseCanBeShown(settings: SharedConceptSettings, experience: Experience) {
    const currentSecondCount = Timestamp.now().seconds;
    const secondCountOfLastTimeSeen = experience.lastTimeSeen.seconds;
    const requiredSecondDifference = getSecondsFromTimeSpan(settings.cooldownTime);
    return currentSecondCount - secondCountOfLastTimeSeen >= requiredSecondDifference;
}

