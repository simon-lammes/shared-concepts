import {Injectable} from '@angular/core';
import {SharedConceptSettings} from './settings.model';
import {AngularFirestore} from '@angular/fire/firestore';
import {AngularFireAuth} from '@angular/fire/auth';
import {first, map, switchMap} from 'rxjs/operators';
import {Observable, of} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class SettingsService {

    constructor(
        private db: AngularFirestore,
        private auth: AngularFireAuth
    ) {
    }

    fetchSettingsSnapshot(): Observable<SharedConceptSettings> {
        return this.fetchUserIdSnapshot()
            .pipe(
                switchMap(userId => {
                    return this.fetchSettingsSnapshotForUserId(userId);
                })
            );
    }

    fetchSettingsSnapshotForUserId(userId: string): Observable<SharedConceptSettings> {
        if (!userId) {
            return of(undefined);
        }
        return this.db.doc<SharedConceptSettings>(`settings/${userId}`).valueChanges()
            .pipe(
                first()
            );
    }

    fetchUserIdSnapshot(): Observable<string> {
        return this.auth.authState
            .pipe(
                first(),
                map(user => user.uid)
            );
    }

    saveSettings(changes: Partial<SharedConceptSettings>): Promise<any> {
        return this.fetchUserIdSnapshot().pipe(
            switchMap(userId => {
                return this.db.doc(`settings/${userId}`).update(changes);
            })
        ).toPromise();
    }
}
