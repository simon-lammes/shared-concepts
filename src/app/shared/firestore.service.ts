import {Injectable} from '@angular/core';
import {Action, AngularFirestore, DocumentSnapshotDoesNotExist, DocumentSnapshotExists} from '@angular/fire/firestore';
import {take} from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class FirestoreService {

    constructor(
        private db: AngularFirestore
    ) {
    }

    upsert<T>(ref: string, data: T): Promise<void> {
        const doc = this.db.doc(ref)
            .snapshotChanges()
            .pipe(take(1))
            .toPromise();

        return doc.then((snap: Action<DocumentSnapshotDoesNotExist | DocumentSnapshotExists<T>>) => {
            if (snap.payload.exists) {
                return this.db.doc(ref).update(data);
            }
            return this.db.doc(ref).set(data);
        });
    }
}
