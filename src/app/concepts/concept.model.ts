export interface Concept {
    title: string;
    foundations: string[];
}

export function getKeyForConcept(concept: Concept) {
    return concept.title.replace(' ', '');
}
