import {Component, OnInit, ViewChild} from '@angular/core';
import {IonSelect, ModalController} from '@ionic/angular';
import {HelpModalComponent} from '../help-modal/help-modal.component';
import {HelpSection} from '../help-modal/help-section.model';
import {SettingsState} from './settings.state';
import {Observable} from 'rxjs';
import {SharedConceptSettings, TimeSpan} from './settings.model';
import {Select, Store} from '@ngxs/store';
import {CooldownTimeChanged} from './settings.actions';

@Component({
    selector: 'app-settings',
    templateUrl: './settings.page.html',
    styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {

    @Select(SettingsState.currentSettings) currentSettings$: Observable<SharedConceptSettings>;
    @ViewChild('cooldownTimeDaySelect') cooldownTimeDaySelect: IonSelect;
    @ViewChild('cooldownTimeHourSelect') cooldownTimeHourSelect: IonSelect;
    @ViewChild('cooldownTimeMinutesSelect') cooldownTimeMinuteSelect: IonSelect;

    constructor(
        private modalController: ModalController,
        private store: Store
    ) {
    }

    ngOnInit() {
    }

    onHelpRequested() {
        const helpSections: HelpSection[] = [
            {
                topic: 'Cooldown Time',
                helpText: 'The cooldown time describes for how long an exercise ' +
                    'cannot be presented to you after you have seen the solution. ' +
                    'Its purpose is to diversify your learning experience.'
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
            days: this.cooldownTimeDaySelect.value,
            hours: this.cooldownTimeHourSelect.value,
            minutes: this.cooldownTimeMinuteSelect.value
        };
        this.store.dispatch(new CooldownTimeChanged(newCooldownTime));
    }

    getArrayWithNumbersFromZeroToN(n: number): number[] {
        // => [0,1,2,3...n]
        return Array.from(Array(n + 1).keys());
    }
}

