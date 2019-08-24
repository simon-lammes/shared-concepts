import {Component, OnInit} from '@angular/core';
import {PopoverController} from '@ionic/angular';

export class MoreRequestedData {
    chosenOption: 'DISABLE_EXERCISE' | 'DISABLE_EXERCISE_TYPE';
}

@Component({
    selector: 'app-more-requested',
    templateUrl: './more-requested.component.html',
    styleUrls: ['./more-requested.component.scss'],
})
export class MoreRequestedComponent implements OnInit {

    constructor(
        private popoverController: PopoverController
    ) {
    }

    ngOnInit() {
    }

    onDismiss() {
        return this.popoverController.dismiss();
    }

    deactivateExercise() {
        const data: MoreRequestedData = {
            chosenOption: 'DISABLE_EXERCISE'
        };
        return this.popoverController.dismiss(data);
    }

    deactivateExerciseType() {
        const data: MoreRequestedData = {
            chosenOption: 'DISABLE_EXERCISE_TYPE'
        };
        return this.popoverController.dismiss(data);
    }
}
