import {Observable} from 'rxjs';

import {Injectable} from '@angular/core';
import {first, map, switchMap, withLatestFrom} from 'rxjs/operators';
import {Concept} from '../concepts/concept.model';
import {ExperienceMap, getDefaultExperience, updateExperience} from '../experience/experience.model';
import {ExperienceService} from '../experience/experience.service';
import {Select} from '@ngxs/store';
import {ConceptState} from '../concepts/concept.state';
import {FirebaseService} from '../shared/firebase.service';

@Injectable({
    providedIn: 'root'
})
export class ExerciseService {
    @Select(ConceptState.conceptMap) conceptMap$: Observable<{ [key: string]: Concept }>;
    @Select(ConceptState.mainConceptToStudy) mainConceptToStudy$: Observable<Concept>;
    @Select(ConceptState.allConceptsToStudyKeys) allConceptsToStudyKeys$: Observable<string[]>;

    constructor(
        private experienceService: ExperienceService,
        private dbService: FirebaseService
    ) {
    }

    getConceptByKey$(conceptKey: string): Observable<Concept> {
        return this.conceptMap$
            .pipe(
                first(),
                map(conceptMap => {
                    return conceptMap[conceptKey];
                })
            );
    }

    getNextConceptKeyToStudy$(): Observable<string> {
        return this.experienceService.experiencesOfCurrentUser$.pipe(
            first(),
            withLatestFrom(this.allConceptsToStudyKeys$, this.conceptMap$),
            map(([experiencesOfCurrentUser, allConceptsToStudyKeys, conceptMap]) => {
                return this.getNextConceptKeyToStudy(conceptMap, allConceptsToStudyKeys, experiencesOfCurrentUser);
            })
        );
    }

    getNextConceptKeyToStudy(
        conceptMap: { [key: string]: Concept },
        allConceptsToStudyKeys: string[],
        experiencesOfCurrentUser: ExperienceMap
    ) {
        const possibleNextConcepts = allConceptsToStudyKeys
            .map(key => conceptMap[key])
            .filter(concept => !!concept.exercise);
        possibleNextConcepts.sort((a, b) => {
            const experienceA = experiencesOfCurrentUser[a.key];
            const experienceB = experiencesOfCurrentUser[b.key];
            if (!experienceA && !experienceB) {
                return a.title.localeCompare(b.title);
            }
            if (!experienceA) {
                return -1;
            }
            if (!experienceB) {
                return 1;
            }
            return experienceA.correctStreak - experienceB.correctStreak;
        });
        return possibleNextConcepts[0].key;
    }

    saveExperienceOfCurrentUser(updatedExperiences: ExperienceMap): Promise<any> {
        return this.dbService.fetchUserIdSnapshot().pipe(
            switchMap(userId => {
                return this.dbService.upsert(`experiences/${userId}`, updatedExperiences);
            })
        ).toPromise();
    }

    saveUserAnswerResult(conceptKey: string, answeredCorrectly: boolean) {
        return this.experienceService.fetchExperiencesOfCurrentUser$().pipe(
            first(),
            withLatestFrom(this.dbService.fetchUserIdSnapshot()),
            switchMap(([experienceMap, user]) => {
                let changingExperience = experienceMap[conceptKey];
                if (!changingExperience) {
                    changingExperience = getDefaultExperience(conceptKey);
                    experienceMap[conceptKey] = changingExperience;
                }
                updateExperience(changingExperience, answeredCorrectly);
                return this.dbService.upsert(`experiences/${user}`, experienceMap);
            })
        );
    }
}
