import {Injectable} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {Observable} from 'rxjs';
import {ExperienceMap} from './experience.model';
import {AngularFireAuth} from '@angular/fire/auth';
import {map, switchMap} from 'rxjs/operators';
import {untilDestroyed} from 'ngx-take-until-destroy';
import {OnDestroy} from '@angular/core/src/metadata/lifecycle_hooks';

@Injectable({
    providedIn: 'root'
})
export class ExperienceService implements OnDestroy {

    experiencesOfCurrentUser$: Observable<ExperienceMap>;

    constructor(
        private db: AngularFirestore,
        private auth: AngularFireAuth
    ) {
        this.experiencesOfCurrentUser$ = this.fetchExperiencesOfCurrentUser$();
    }

    fetchExperiencesOfCurrentUser$(): Observable<ExperienceMap> {
        return this.auth.authState.pipe(
            switchMap(user => {
                return this.db.doc<ExperienceMap>
                (`experiences/${user.uid}`).valueChanges();
            }),
            map(experienceMap => {
                if (!experienceMap) {
                    experienceMap = {};
                }
                return experienceMap;
            }),
            untilDestroyed(this)
        );
    }

    ngOnDestroy(): void {
    }
}
