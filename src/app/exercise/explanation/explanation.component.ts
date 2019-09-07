import {Component, Input} from '@angular/core';
import {Exercise} from '../exercise.model';

@Component({
    selector: 'app-explanation',
    templateUrl: './explanation.component.html',
    styleUrls: ['./explanation.component.scss'],
})
export class ExplanationComponent {

    @Input() exercise: Exercise;
    @Input() backCodeSnippetMarkdown: string;

    constructor() {
    }
}
