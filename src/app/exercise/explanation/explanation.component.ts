import {Component, Input, OnInit} from '@angular/core';
import {Exercise} from '../exercise.model';

@Component({
    selector: 'app-explanation',
    templateUrl: './explanation.component.html',
    styleUrls: ['./explanation.component.scss'],
})
export class ExplanationComponent implements OnInit {

    @Input() exercise: Exercise;

    constructor() {
    }

    ngOnInit() {
    }

}
