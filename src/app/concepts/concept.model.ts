import {Exercise} from '../exercise/exercise.model';

export interface Concept {
    key: string;
    title: string;
    foundationKeys: string[];
    exercise: Exercise;
}

export function getKeyForConcept(concept: Concept) {
    return concept.title.replace(' ', '');
}
