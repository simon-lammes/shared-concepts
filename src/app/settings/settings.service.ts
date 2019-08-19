import {Injectable} from '@angular/core';
import {defaultSettings, SharedConceptSettings} from './settings.model';
import {AngularFirestore} from '@angular/fire/firestore';
import {AngularFireAuth} from '@angular/fire/auth';
import {map, switchMap} from 'rxjs/operators';
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
            return of(defaultSettings());
        }
        return this.db.doc<SharedConceptSettings>(`settings/${userId}`).valueChanges().pipe(
            map(settings => {
                const settingsDoNotYetExist = !settings;
                if (settingsDoNotYetExist) {
                    return defaultSettings();
                }
                return settings;
            })
        );
    }

    saveSettings(changes: Partial<SharedConceptSettings>): Observable<any> {
        return this.dbService.fetchUserIdSnapshot().pipe(
            switchMap(userId => {
                if (!userId) {
                    return of(undefined);
                }
                return this.dbService.upsert(`settings/${userId}`, changes);
            })
        );
    }
}
