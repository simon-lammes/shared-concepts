import {Injectable} from '@angular/core';
import {SharedConceptSettings} from './settings.model';
import {AngularFirestore} from '@angular/fire/firestore';
import {AngularFireAuth} from '@angular/fire/auth';
import {switchMap} from 'rxjs/operators';
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

    fetchSettingsForCurrentUser$(): Observable<SharedConceptSettings> {
        return this.dbService.fetchUserId$()
            .pipe(
                switchMap(userId => {
                    return this.fetchSettingsForUserId$(userId);
                })
            );
    }

    fetchSettingsForUserId$(userId: string): Observable<SharedConceptSettings> {
        if (!userId) {
            return of(undefined);
        }
        return this.db.doc<SharedConceptSettings>(`settings/${userId}`).valueChanges();
    }

    saveSettings(changes: Partial<SharedConceptSettings>): Promise<any> {
        return this.dbService.fetchUserIdSnapshot().pipe(
            switchMap(userId => {
                return this.dbService.upsert(`settings/${userId}`, changes);
            })
        ).toPromise();
    }
}
