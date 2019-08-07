import {Observable} from 'rxjs';
import {Component, OnDestroy, OnInit} from '@angular/core';
import {Exercise} from './exercise.model';
import {Select, Store} from '@ngxs/store';
import {ExerciseState} from './exercise.state';
import {ExercisesRequested} from './exercise.actions';

@Component({
    selector: 'app-exercise',
    templateUrl: './exercise.page.html',
    styleUrls: ['./exercise.page.scss'],
})
export class ExercisePage implements OnInit, OnDestroy {
    @Select(ExerciseState.currentExercise) currentExercise$: Observable<Exercise>;
    errorMessage: string;

    constructor(
        private store: Store
    ) {
    }

    ngOnDestroy() {
    }

    ngOnInit() {
        this.store.dispatch(new ExercisesRequested(
            [
                'HowIsTheSmallSpaceBetweenTwoNeuronsCalled',
                'HowManyAxonsArePartOfOneNeuron',
                'WhichPartOfANeuronReceivesElectricalSignals'
            ]));
    }

    onAnswered(answeredCorrectly: boolean) {
        console.log('correct: ', answeredCorrectly);
    }
}
