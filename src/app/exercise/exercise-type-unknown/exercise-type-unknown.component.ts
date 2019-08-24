import {Component, EventEmitter, OnInit, Output} from '@angular/core';

@Component({
    selector: 'app-exercise-type-unknown',
    templateUrl: './exercise-type-unknown.component.html',
    styleUrls: ['./exercise-type-unknown.component.scss'],
})
export class ExerciseTypeUnknownComponent implements OnInit {
    @Output() disableExerciseAndContinue: EventEmitter<void> = new EventEmitter<void>();

    constructor() {
    }

    ngOnInit() {
    }

    onDisableExerciseAndContinue() {
        this.disableExerciseAndContinue.emit();
    }
}
