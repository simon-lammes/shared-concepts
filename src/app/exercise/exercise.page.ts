import {Observable} from 'rxjs';
import {Component, OnInit} from '@angular/core';
import {Select} from '@ngxs/store';
import {ConceptState} from '../concepts/concept.state';
import {Concept} from '../concepts/concept.model';
import {first, map, switchMap} from 'rxjs/operators';
import {ActivatedRoute} from '@angular/router';

@Component({
    selector: 'app-exercise',
    templateUrl: './exercise.page.html',
    styleUrls: ['./exercise.page.scss'],
})
export class ExercisePage implements OnInit {
    @Select(ConceptState.conceptMap) conceptMap$: Observable<{ [key: string]: Concept }>;
    @Select(ConceptState.conceptToStudy) conceptToStudy$: Observable<Concept>;
    conceptKey$: Observable<string>;
    concept$: Observable<Concept>;
    answeredCorrectly: boolean = undefined;

    constructor(private route: ActivatedRoute) {
    }

    ngOnInit(): void {
        const getConceptByConceptKey = conceptKey => {
            return this.conceptMap$
                .pipe(
                    first(),
                    map(conceptMap => {
                        return conceptMap[conceptKey];
                    })
                );
        };
        this.conceptKey$ = this.route.paramMap.pipe(
            first(),
            map(paramMap => {
                return paramMap.get('conceptKey');
            })
        );
        this.concept$ = this.conceptKey$.pipe(
            first(),
            switchMap(conceptKey => {
                return getConceptByConceptKey(conceptKey);
            })
        );
    }

    onAnswered(answeredCorrectly: boolean) {
        this.answeredCorrectly = answeredCorrectly;
    }
}
