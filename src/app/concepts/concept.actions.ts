import {Concept} from './concept.model';

export class TopLevelConceptsRequested {
    static readonly type = '[Concept Page] Load Top Level Concepts';
}

export class LoadConcept {
    static readonly type = '[Concept Page] Load Concept';

    constructor(public conceptKey: string) {
    }
}

export class LoadConcepts {
    static readonly type = '[Concept Page] Load Concepts';

    constructor(public conceptKeys: string[]) {
    }
}

export class LoadFoundationConceptsToStudyRecursively {
    static readonly type = '[Concept Page] Load Foundation Concepts Recursively';

    constructor(public concept: Concept) {
    }
}

export class NavigatedToConceptKey {
    static readonly type = '[Concept Page] Go To Concept Key';

    constructor(public conceptKey: string) {
    }
}

export class ChooseConceptToStudy {
    static readonly type = '[Concept Page] Choose Concept To Study';

    constructor(public concept: Concept) {
    }
}

export class ConceptUpserted {
    static readonly type = '[Concept Page] Concept Upserted';

    constructor(public concept: Concept) {
    }
}

export class ConceptMarkedAsTopLevelConcept {
    static readonly type = '[Concept Page] Concept Marked As Top Level Concept';

    constructor(public concept: Concept) {
    }
}
