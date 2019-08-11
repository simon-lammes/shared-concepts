import {Observable} from 'rxjs';
import {Component} from '@angular/core';
import {Exercise} from './exercise.model';
import {Select} from '@ngxs/store';
import {ExerciseState} from './exercise.state';
import {ConceptState} from '../concepts/concept.state';
import {Concept} from '../concepts/concept.model';

@Component({
    selector: 'app-exercise',
    templateUrl: './exercise.page.html',
    styleUrls: ['./exercise.page.scss'],
})
export class ExercisePage {
    @Select(ExerciseState.currentExercise) currentExercise$: Observable<Exercise>;
    @Select(ConceptState.conceptToExerciseNext) conceptToExerciseNext$: Observable<Concept>;
    answeredCorrectly: boolean = undefined;

    constructor() {
    }

    onAnswered(answeredCorrectly: boolean) {
        this.answeredCorrectly = answeredCorrectly;
    }
}
