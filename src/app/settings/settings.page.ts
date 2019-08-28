import {Component, OnInit} from '@angular/core';
import {AlertController, ModalController} from '@ionic/angular';
import {HelpModalComponent} from '../help-modal/help-modal.component';
import {HelpSection} from '../help-modal/help-section.model';
import {Observable} from 'rxjs';
import {SharedConceptSettings} from './settings.model';
import {SettingsService} from './settings.service';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {Store} from '@ngxs/store';
import {StateResetAll} from 'ngxs-reset-plugin';

@Component({
    selector: 'app-settings',
    templateUrl: './settings.page.html',
    styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {

    settingsForm: FormGroup;
    currentSettings$: Observable<SharedConceptSettings>;
    get conceptKeysOfDisabledExercises() {
        return this.settingsForm.get('conceptKeysOfDisabledExercises') as FormArray;
    }

    constructor(
        private modalController: ModalController,
        private settingsService: SettingsService,
        private alertController: AlertController,
        private formBuilder: FormBuilder,
        private store: Store
    ) {
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
                conceptKeysOfDisabledExercises: this.formBuilder.array([])
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
            }
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

    onHelpRequested() {
        const helpSections: HelpSection[] = [
            {
                topic: 'Cooldown Time',
                helpText: 'The cooldown time describes for how long an exercise ' +
                    'cannot be presented to you after you have seen the solution. ' +
                    'Its purpose is to diversify your learning experience.'
            },
            {
                topic: 'Clear Cache',
                helpText: 'Clearing the cache helps when the concepts on the server have changed and you want to get those changes. ' +
                    'By clearing the cache, all concepts have to be fetched again and thereby you get the new concepts.'
            },
            {
                topic: 'Activated Exercise Types',
                helpText: 'There are different types of exercises. Only exercising with types that you activated will be shown to you.'
            }
        ];
        this.modalController.create({
            component: HelpModalComponent,
            componentProps: {
                helpSections,
                title: 'Settings'
            }
        }).then(modalElement => modalElement.present());
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
                        console.log('clear state');
                        this.store.dispatch(new StateResetAll());
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

