import {Observable} from 'rxjs';
import {Injectable} from '@angular/core';
import {first, map, withLatestFrom} from 'rxjs/operators';
import {Concept} from '../concepts/concept.model';
import {Experience} from '../experience/experience.model';
import {ExperienceService} from '../experience/experience.service';
import {Select} from '@ngxs/store';
import {ConceptState} from '../concepts/concept.state';

@Injectable({
    providedIn: 'root'
})
export class ExerciseService {
    @Select(ConceptState.conceptMap) conceptMap$: Observable<{ [key: string]: Concept }>;
    @Select(ConceptState.mainConceptToStudy) mainConceptToStudy$: Observable<Concept>;
    @Select(ConceptState.allConceptsToStudyKeys) allConceptsToStudyKeys$: Observable<string[]>;

    constructor(private experienceService: ExperienceService) {
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
        experiencesOfCurrentUser: { [conceptKey: string]: Experience }
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

}
