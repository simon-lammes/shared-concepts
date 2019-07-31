import { DocumentReference } from '@angular/fire/firestore';

export class Concept {
    constructor(
        public title: string,
        public foundations: Concept[]
    ){}
}