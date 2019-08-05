export interface Concept {
    title: string;
    foundationKeys: string[];
    exerciseKeys: string[];
}

export function getKeyForConcept(concept: Concept) {
    return concept.title.replace(' ', '');
}
