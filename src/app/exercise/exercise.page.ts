import {Observable} from 'rxjs';
import {Component, OnInit} from '@angular/core';
import {Select} from '@ngxs/store';
import {ConceptState} from '../concepts/concept.state';
import {Concept} from '../concepts/concept.model';
import {first, map, switchMap} from 'rxjs/operators';
import {ActivatedRoute, Router} from '@angular/router';
import {ExerciseService} from './exercise.service';

@Component({
    selector: 'app-exercise',
    templateUrl: './exercise.page.html',
    styleUrls: ['./exercise.page.scss'],
})
export class ExercisePage implements OnInit {
    @Select(ConceptState.mainConceptToStudy) mainConceptToStudy$: Observable<Concept>;
    conceptKey$: Observable<string>;
    concept$: Observable<Concept>;
    answeredCorrectly: boolean = undefined;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private exerciseService: ExerciseService
    ) {
    }

    ngOnInit(): void {
        this.conceptKey$ = this.route.paramMap.pipe(
            first(),
            map(paramMap => {
                return paramMap.get('conceptKey');
            })
        );
        this.concept$ = this.conceptKey$.pipe(
            first(),
            switchMap(conceptKey => {
                return this.exerciseService.getConceptByKey$(conceptKey);
            })
        );
    }

    onAnswered(answeredCorrectly: boolean) {
        this.answeredCorrectly = answeredCorrectly;
    }

    navigateToNextExercise() {
        this.exerciseService.getNextConceptKeyToStudy$().subscribe(conceptKey => {
            this.router.navigateByUrl(`exercise/${conceptKey}`);
        });
    }
}

