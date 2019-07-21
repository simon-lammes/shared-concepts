import { DocumentReference } from '@angular/fire/firestore';

export class Concept {
    constructor(
        public id: string,
        public title: string,
        public isTopLevel: boolean,
        public foundationFor: DocumentReference[] = []
    ){}
}