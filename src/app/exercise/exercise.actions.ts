export class ExerciseRequested {
    static readonly type = '[Exercise Page] Exercise Requested';

    constructor(public exerciseKey: string) {
    }
}

export class ExercisesRequested {
    static readonly type = '[Exercise Page] Exercises Requested';

    constructor(public exerciseKeys: string[]) {
    }
}
