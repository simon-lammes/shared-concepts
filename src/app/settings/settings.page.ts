import {Component, OnInit} from '@angular/core';
import {AlertController, ModalController} from '@ionic/angular';
import {Observable} from 'rxjs';
import {SharedConceptSettings} from './settings.model';
import {SettingsService} from './settings.service';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {Store} from '@ngxs/store';
import {StateClear} from 'ngxs-reset-plugin';

@Component({
    selector: 'app-settings',
    templateUrl: './settings.page.html',
    styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {

    settingsForm: FormGroup;
    currentSettings$: Observable<SharedConceptSettings>;

    constructor(
        private modalController: ModalController,
        private settingsService: SettingsService,
        private alertController: AlertController,
        private formBuilder: FormBuilder,
        private store: Store
    ) {
    }

    get conceptKeysOfDisabledExercises() {
        return this.settingsForm.get('conceptKeysOfDisabledExercises') as FormArray;
    }

    ngOnInit() {
        this.currentSettings$ = this.settingsService.fetchSettingsForCurrentUser$();
        this.currentSettings$.subscribe(settings => {
            this.settingsForm = this.formBuilder.group({
                days: '' + settings.cooldownTime.days,
                hours: '' + settings.cooldownTime.hours,
                minutes: '' + settings.cooldownTime.minutes,
                imageOcclusionActivated: !settings.disabledExerciseTypes.includes('IMAGE_OCCLUSION'),
                multipleResponseQuestionActivated: !settings.disabledExerciseTypes.includes('MULTIPLE_RESPONSE_QUESTION'),
                termPromptActivated: !settings.disabledExerciseTypes.includes('TERM_PROMPT'),
                conceptKeysOfDisabledExercises: this.formBuilder.array([]),
                editorMode: settings.editorMode
            });
            settings.conceptKeysOfDisabledExercises.sort()
                .forEach(key => this.conceptKeysOfDisabledExercises.push(this.formBuilder.control(key)));
        });
    }

    updateSettings() {
        const newSettings: SharedConceptSettings = {
            disabledExerciseTypes: [],
            conceptKeysOfDisabledExercises: [],
            cooldownTime: {
                days: parseInt(this.settingsForm.value.days, 10),
                hours: parseInt(this.settingsForm.value.hours, 10),
                minutes: parseInt(this.settingsForm.value.minutes, 10)
            },
            editorMode: this.settingsForm.value.editorMode
        };
        if (!this.settingsForm.value.imageOcclusionActivated) {
            newSettings.disabledExerciseTypes.push('IMAGE_OCCLUSION');
        }
        if (!this.settingsForm.value.multipleResponseQuestionActivated) {
            newSettings.disabledExerciseTypes.push('MULTIPLE_RESPONSE_QUESTION');
        }
        if (!this.settingsForm.value.termPromptActivated) {
            newSettings.disabledExerciseTypes.push('TERM_PROMPT');
        }
        newSettings.conceptKeysOfDisabledExercises = this.conceptKeysOfDisabledExercises.controls.map(control => control.value);
        this.settingsService.saveSettings(newSettings).subscribe();
    }

    getArrayWithNumbersFromZeroToN(n: number): number[] {
        // => [0,1,2,3...n]
        return Array.from(Array(n + 1).keys());
    }

    onClearConceptStateRequested() {
        this.alertController.create({
            header: 'Clear Concept State',
            message: 'When you clear the state, all concepts have to be fetched again from the server. ' +
                'Nevertheless, this is not a dangerous operation. ' +
                'This operation is useful when you want to fetch the newest concepts from the server.',
            buttons: [
                {
                    text: 'clear state',
                    handler: () => {
                        this.store.dispatch(new StateClear());
                        // I found no other way to bring the state back to default than to refresh the page.
                        // You would expect the action StateResetAll to do the job, but somehow it does not work.
                        location.reload();
                    }
                },
                {
                    text: 'cancel',
                    role: 'cancel'
                }
            ]
        }).then(toastElement => toastElement.present());
    }
}

