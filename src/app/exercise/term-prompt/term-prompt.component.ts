import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild} from '@angular/core';
import {Exercise} from '../exercise.model';
import {FormBuilder, FormGroup} from '@angular/forms';
import {IonInput} from '@ionic/angular';

@Component({
    selector: 'app-term-prompt',
    templateUrl: './term-prompt.component.html',
    styleUrls: ['./term-prompt.component.scss'],
})
export class TermPromptComponent implements OnChanges {
    @Input() termPromptExercise: Exercise;
    @Input() activated: boolean;
    @Output() correctlyAnswered: EventEmitter<boolean> = new EventEmitter<boolean>();
    @ViewChild('answer', {static: false}) answerField: IonInput;
    exercise: FormGroup;

    constructor(
        private formBuilder: FormBuilder
    ) {
        this.exercise = this.formBuilder.group({
            answer: ''
        });
    }

    static compareTerms(a: string, b: string): boolean {
        if (!a || !b) {
            return false;
        }
        const x = a.replace(/-/g, '').toLowerCase().trim();
        const y = b.replace(/-/g, '').toLowerCase().trim();
        return x === y;
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (this.activated && this.exercise.controls.answer.disabled) {
            this.exercise.reset();
            this.exercise.controls.answer.enable();
        }
        if (!this.activated && this.exercise.controls.answer.enabled) {
            this.exercise.disable();
        }
    }

    submitAnswer() {
        if (this.correctlyAnswered.closed) {
            return;
        }
        const answer: string = this.exercise.value.answer;
        const answerIsCorrect = this.termPromptExercise.possibleTerms.some(term => TermPromptComponent.compareTerms(term, answer));
        this.correctlyAnswered.emit(answerIsCorrect);
    }
}
