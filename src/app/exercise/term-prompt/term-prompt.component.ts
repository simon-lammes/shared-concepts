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
    @Output() correctlyAnswered: EventEmitter<boolean> = new EventEmitter<boolean>();
    @ViewChild('answer') answerField: IonInput;
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
        const noValueChanged = JSON.stringify(changes.previousValue) === JSON.stringify(changes.currentValue);
        if (noValueChanged) {
            return;
        }
        this.exercise.controls.answer.enable();
        this.exercise.reset();
    }

    submitAnswer() {
        if (this.correctlyAnswered.closed) {
            return;
        }
        const answer: string = this.exercise.value.answer;
        const answerIsCorrect = this.termPromptExercise.possibleTerms.some(term => TermPromptComponent.compareTerms(term, answer));
        this.exercise.controls.answer.disable();
        this.correctlyAnswered.emit(answerIsCorrect);
    }
}
