import {Exercise} from '../exercise/exercise.model';

export interface Concept {
    key: string;
    title: string;
    foundationKeys: string[];
    description?: string;
    exercise?: Exercise;
    imageKey?: string;
}
