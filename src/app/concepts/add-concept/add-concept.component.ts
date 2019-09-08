import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Concept} from '../concept.model';
import {Store} from '@ngxs/store';
import {ConceptMarkedAsTopLevelConcept, ConceptUpserted} from '../concept.actions';

@Component({
    selector: 'app-add-concept',
    templateUrl: './add-concept.component.html',
    styleUrls: ['./add-concept.component.scss'],
})
export class AddConceptComponent implements OnInit {
    readonly minConceptTitleLength = 3;
    newConceptForm: FormGroup;
    @Input() conceptForWhichTheNewConceptBuildsTheFoundation: Concept;
    const;

    constructor(
        private formBuilder: FormBuilder,
        private store: Store
    ) {
    }

    get conceptTitle() {
        return this.newConceptForm.value.conceptTitle as string;
    }

    set conceptTitle(value: string) {
        this.newConceptForm.patchValue({
            conceptTitle: value
        });
    }

    get controls() {
        return this.newConceptForm.controls;
    }

    ngOnInit() {
        this.setUpForm();
    }

    addConcept() {
        this.removeExtraWhiteSpacesFromConceptTitle();
        if (this.newConceptForm.invalid) {
            this.newConceptForm.markAllAsTouched();
            return;
        }
        const newConcept: Concept = {
            title: this.conceptTitle,
            key: this.getConceptKeyForConceptTitle(this.conceptTitle),
            foundationKeys: []
        };
        // the form should be empty after submitting
        this.setUpForm();
        this.store.dispatch(new ConceptUpserted(newConcept));
        // There are two possibilities: The concept is either a foundation of another concept or it is a top level concept.
        if (this.conceptForWhichTheNewConceptBuildsTheFoundation) {
            const updatedConceptForWhichTheNewConceptBuildsTheFoundation = {
                ...this.conceptForWhichTheNewConceptBuildsTheFoundation,
                foundationKeys: this.conceptForWhichTheNewConceptBuildsTheFoundation.foundationKeys.concat(newConcept.key)
            };
            this.store.dispatch(new ConceptUpserted(updatedConceptForWhichTheNewConceptBuildsTheFoundation));
        } else {
            this.store.dispatch(new ConceptMarkedAsTopLevelConcept(newConcept));
        }
    }

    getConceptKeyForConceptTitle(title: string) {
        const fragments = title.trim().split(' ');
        let key = '';
        for (const fragment of fragments) {
            key += fragment[0].toUpperCase() + fragment.slice(1);
        }
        return key.replace(/\./g, '');
    }

    private removeExtraWhiteSpacesFromConceptTitle() {
        this.conceptTitle = this.conceptTitle.trim().replace(/\s+/g, ' ');
    }

    private setUpForm() {
        this.newConceptForm = this.formBuilder.group({
            conceptTitle: ['', [Validators.required, Validators.minLength(this.minConceptTitleLength)]]
        });
    }
}
