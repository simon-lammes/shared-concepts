import {Injectable} from '@angular/core';
import {SharedConceptSettings} from './settings.model';
import {AngularFirestore} from '@angular/fire/firestore';
import {AngularFireAuth} from '@angular/fire/auth';
import {first, map, switchMap} from 'rxjs/operators';
import {Observable, of} from 'rxjs';
import {FirebaseService} from '../shared/firebase.service';

@Injectable({
    providedIn: 'root'
})
export class SettingsService {

    constructor(
        private db: AngularFirestore,
        private auth: AngularFireAuth,
        private dbService: FirebaseService
    ) {
    }

    fetchSettingsSnapshot(): Observable<SharedConceptSettings> {
        return this.dbService.fetchUserIdSnapshot()
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
                map(user => {
                    if (!user) {
                        return undefined;
                    }
                    return user.uid;
                })
            );
    }

    saveSettings(changes: Partial<SharedConceptSettings>): Promise<any> {
        return this.dbService.fetchUserIdSnapshot().pipe(
            switchMap(userId => {
                return this.dbService.upsert(`settings/${userId}`, changes);
            })
        ).toPromise();
    }
}
