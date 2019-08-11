import {Exercise} from '../exercise/exercise.model';
import {Experience} from '../experience/experience.model';

export interface Concept {
    key: string;
    title: string;
    foundationKeys: string[];
    description?: string;
    exercise?: Exercise;
    experience?: Experience;
}

export function getKeyForConcept(concept: Concept) {
    return concept.title.replace(' ', '');
}
