import {Component, Input, OnInit} from '@angular/core';
import {Exercise, ExerciseType} from '../exercise.model';

@Component({
    selector: 'app-explanation',
    templateUrl: './explanation.component.html',
    styleUrls: ['./explanation.component.scss'],
})
export class ExplanationComponent implements OnInit {

    @Input() exercise: Exercise;
    get exerciseIsOfTypeTermPrompt() {
        return this.exercise.type.toString() === ExerciseType[ExerciseType.TERM_PROMPT];
    }

    constructor() {
    }

    ngOnInit() {
    }

}
