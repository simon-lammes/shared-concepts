import { DocumentReference } from '@angular/fire/firestore';

export interface Concept {
    title: string;
    foundations: Concept[];
}
