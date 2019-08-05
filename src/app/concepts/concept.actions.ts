import {Concept} from './concept.model';

export class LoadTopLevelConcepts {
    static readonly type = '[Concept Page] Load Top Level Concepts';
}

export class LoadConcept {
    static readonly type = '[Concept Page] Load Concept';
    constructor(public conceptKey: string) {}
}

export class LoadConcepts {
    static readonly type = '[Concept Page] Load Concepts';
    constructor(public conceptKeys: string[]) {}
}

export class GoToConcept {
    static readonly type = '[Concept Page] Go To Concept';
    constructor(public concept: Concept) {}
}

export class GoToConceptKey {
    static readonly type = '[Concept Page] Go To Concept Key';
    constructor(public conceptKey: string) {}
}
