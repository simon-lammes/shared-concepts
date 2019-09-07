import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {Exercise} from '../exercise.model';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {shuffle} from '../../shared/universal-helper.functions';

@Component({
    selector: 'app-multiple-response-question',
    templateUrl: './multiple-response-question.component.html',
    styleUrls: ['./multiple-response-question.component.scss'],
})
export class MultipleResponseQuestionComponent implements OnInit, OnChanges {
    @Input() multipleResponseQuestion: Exercise;
    @Input() frontCodeSnippetMarkdown: string;
    @Input() activated: boolean;
    @Output() correctlyAnswered: EventEmitter<boolean> = new EventEmitter<boolean>();
    exerciseForm: FormGroup;
    responseOptions: string[];

    constructor(private formBuilder: FormBuilder) {
    }

    get responseOptionsFormArray() {
        return this.exerciseForm.get('responseOptions') as FormArray;
    }

    ngOnInit() {
        this.setUpForm();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (!this.exerciseForm || !this.responseOptions) {
            return;
        }
        if (this.activated && this.exerciseForm.disabled) {
            this.setUpForm();
        }
        if (!this.activated) {
            this.exerciseForm.disable();
        }
    }

    submitAnswer() {
        for (let i = 0; i < this.responseOptions.length; i++) {
            const control = this.responseOptionsFormArray.controls[i];
            const responseOption = this.responseOptions[i];
            const checked = control.value;
            const shouldBeChecked = this.multipleResponseQuestion.correctResponses.includes(responseOption);
            if (checked !== shouldBeChecked) {
                this.correctlyAnswered.emit(false);
                return;
            }
        }
        this.correctlyAnswered.emit(true);
    }

    // after the user submitted his answeres we should color the options to indicate which ones are correct
    getColorForResponseOption(responseOption: string) {
        if (this.activated) {
            // the user has not yet answered so he should not see any hint
            return undefined;
        }
        const itemDisplaysCorrectAnswer = this.multipleResponseQuestion.correctResponses.includes(responseOption);
        return itemDisplaysCorrectAnswer ? 'success' : 'danger';
    }

    private setUpForm() {
        this.responseOptions = this.multipleResponseQuestion.correctResponses.concat(this.multipleResponseQuestion.wrongResponses);
        // The response options should be in random order so that the user does not know which ones are correct.
        shuffle(this.responseOptions);
        this.exerciseForm = this.formBuilder.group({
            // every response is unchecked at the beginning so we set the values to false
            responseOptions: this.formBuilder.array(this.responseOptions.map(() => false))
        });
    }
}
