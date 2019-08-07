import {Exercise} from './exercise.model';
import {Action, Selector, State, StateContext} from '@ngxs/store';
import {ExerciseService} from './exercise.service';
import {ExerciseRequested, ExercisesRequested} from './exercise.actions';
import {concatMap, switchMap, tap} from 'rxjs/operators';
import {of} from 'rxjs';

export interface ExerciseStateModel {
    exerciseMap: {
        [key: string]: Exercise
    };
}

@State<ExerciseStateModel>({
    name: 'exercises',
    defaults: {
        exerciseMap: undefined
    }
})
export class ExerciseState {

    constructor(private exerciseService: ExerciseService) {
    }

    @Selector()
    static currentExercise(state: ExerciseStateModel): Exercise {
        const exerciseMap = state.exerciseMap;
        if (!exerciseMap) {
            return;
        }
        return exerciseMap.HowIsTheSmallSpaceBetweenTwoNeuronsCalled;
    }

    @Action(ExercisesRequested)
    exercisesRequested(ctx: StateContext<ExerciseStateModel>, action: ExercisesRequested) {
        return of(action.exerciseKeys)
            .pipe(
                switchMap(exerciseKeys => exerciseKeys),
                concatMap(exerciseKey => ctx.dispatch(new ExerciseRequested(exerciseKey)))
            );
    }

    @Action(ExerciseRequested)
    exerciseRequested(ctx: StateContext<ExerciseStateModel>, action: ExerciseRequested) {
        const exerciseKey = action.exerciseKey;
        const currentExerciseMap = ctx.getState().exerciseMap;
        const exerciseAlreadyCached = !!currentExerciseMap && !!currentExerciseMap[exerciseKey];
        if (exerciseAlreadyCached) {
            return;
        }
        return this.exerciseService.loadConceptByKey(exerciseKey)
            .pipe(
                tap(exercise => {
                    const nextExerciseMap = {...currentExerciseMap};
                    nextExerciseMap[exerciseKey] = exercise;
                    ctx.patchState({
                        exerciseMap: nextExerciseMap
                    });
                })
            );
    }
}
