import {Injectable} from '@angular/core';
import {Action, AngularFirestore, DocumentSnapshotDoesNotExist, DocumentSnapshotExists} from '@angular/fire/firestore';
import {first, map, take} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {AngularFireAuth} from '@angular/fire/auth';

@Injectable({
    providedIn: 'root'
})
export class FirebaseService {

    constructor(
        private db: AngularFirestore,
        private auth: AngularFireAuth
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

    fetchUserIdSnapshot(): Observable<string> {
        return this.fetchUserId$().pipe(first());
    }

    fetchUserId$(): Observable<string> {
        return this.auth.authState
            .pipe(
                map(user => {
                    if (!user) {
                        return undefined;
                    }
                    return user.uid;
                })
            );
    }
}
