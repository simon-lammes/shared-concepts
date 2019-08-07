import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Exercise} from '../exercise.model';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
    selector: 'app-term-prompt',
    templateUrl: './term-prompt.component.html',
    styleUrls: ['./term-prompt.component.scss'],
})
export class TermPromptComponent implements OnInit {

    constructor(
        private formBuilder: FormBuilder
    ) {
        this.exercise = this.formBuilder.group({
            answer: ['', Validators.required],
        });
    }

    @Input() termPromptExercise: Exercise;
    @Output() correctlyAnswered: EventEmitter<boolean> = new EventEmitter<boolean>();
    exercise: FormGroup;

    static compareTerms(a: string, b: string): boolean {
        const x = a.replace(/-/g, '').toLowerCase().trim();
        const y = b.replace(/-/g, '').toLowerCase().trim();
        return x === y;
    }

    ngOnInit() {

    }

    submitAnswer() {
        const answer: string = this.exercise.value.answer;
        const answerIsCorrect = this.termPromptExercise.possibleTerms.some(term => TermPromptComponent.compareTerms(term, answer));
        this.correctlyAnswered.emit(answerIsCorrect);
    }
}
