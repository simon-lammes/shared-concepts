import {Component, OnInit, ViewChild} from '@angular/core';
import {AlertController, IonSelect, IonToggle, ModalController} from '@ionic/angular';
import {HelpModalComponent} from '../help-modal/help-modal.component';
import {HelpSection} from '../help-modal/help-section.model';
import {Observable} from 'rxjs';
import {SharedConceptSettings, TimeSpan} from './settings.model';
import {SettingsService} from './settings.service';

@Component({
    selector: 'app-settings',
    templateUrl: './settings.page.html',
    styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {

    currentSettings$: Observable<SharedConceptSettings>;
    @ViewChild('cooldownTimeDaySelect') cooldownTimeDaySelect: IonSelect;
    @ViewChild('cooldownTimeHourSelect') cooldownTimeHourSelect: IonSelect;
    @ViewChild('cooldownTimeMinutesSelect') cooldownTimeMinuteSelect: IonSelect;
    @ViewChild('imageOcclusionToggle') imageOcclusionToggle: IonToggle;
    @ViewChild('multipleResponseQuestionToggle') multipleResponseQuestionToggle: IonToggle;
    @ViewChild('termPromptToggle') termPromptToggle: IonToggle;

    constructor(
        private modalController: ModalController,
        private settingsService: SettingsService,
        private alertController: AlertController
    ) {
    }

    ngOnInit() {
        this.currentSettings$ = this.settingsService.fetchSettingsForCurrentUser$();
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

    onCooldownTimeChanged() {
        const newCooldownTime: TimeSpan = {
            days: parseInt(this.cooldownTimeDaySelect.value, 10),
            hours: parseInt(this.cooldownTimeHourSelect.value, 10),
            minutes: parseInt(this.cooldownTimeMinuteSelect.value, 10)
        };
        const changes: Partial<SharedConceptSettings> = {
            cooldownTime: newCooldownTime
        };
        this.settingsService.saveSettings(changes).subscribe();
    }

    getArrayWithNumbersFromZeroToN(n: number): number[] {
        // => [0,1,2,3...n]
        return Array.from(Array(n + 1).keys());
    }

    onClearCacheRequested() {
        this.alertController.create({
            header: 'Clear Cache',
            message: 'When you clear the cache, all concepts have to be fetched again from the server. ' +
                'Nevertheless, this is not a dangerous operation. ' +
                'This operation is useful when you want to fetch the newest concepts from the server.',
            buttons: [
                {
                    text: 'remove concepts from cache',
                    handler: () => {
                        localStorage.removeItem('@@STATE');
                    }
                },
                {
                    text: 'cancel',
                    role: 'cancel'
                }
            ]
        }).then(toastElement => toastElement.present());
    }

    onActivatedExerciseTypesChanged() {
        const disabledExerciseTypes = [];
        if (!this.imageOcclusionToggle.checked) {
            disabledExerciseTypes.push('IMAGE_OCCLUSION');
        }
        if (!this.multipleResponseQuestionToggle.checked) {
            disabledExerciseTypes.push('MULTIPLE_RESPONSE_QUESTION');
        }
        if (!this.termPromptToggle.checked) {
            disabledExerciseTypes.push('TERM_PROMPT');
        }
        const changes: Partial<SharedConceptSettings> = {
            disabledExerciseTypes
        };
        this.settingsService.saveSettings(changes).subscribe();
    }
}

