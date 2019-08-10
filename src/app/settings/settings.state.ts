import {Action, NgxsOnInit, Selector, State, StateContext} from '@ngxs/store';
import {SharedConceptSettings, TimeSpan} from './settings.model';
import {CooldownTimeChanged} from './settings.actions';
import {SettingsService} from './settings.service';

export interface SettingsStateModel {
    settings: SharedConceptSettings;
}

@State<SettingsStateModel>({
    name: 'settings',
    defaults: {
        settings: {
            cooldownTime: new TimeSpan(4, 2, 0)
        }
    }
})
export class SettingsState implements NgxsOnInit {

    constructor(
        private settingsService: SettingsService
    ) {
    }

    @Selector()
    static currentSettings(state: SettingsStateModel): SharedConceptSettings {
        return state.settings;
    }

    ngxsOnInit(ctx: StateContext<SettingsStateModel>) {
        this.settingsService.fetchSettingsSnapshot().subscribe(fetchedSettings => {
            if (!fetchedSettings) {
                return;
            }
            ctx.patchState({
                settings: fetchedSettings
            });
        });
    }

    @Action(CooldownTimeChanged)
    settingsChanged(ctx: StateContext<SettingsStateModel>, action: CooldownTimeChanged) {
        const newSettings = {...ctx.getState().settings};
        newSettings.cooldownTime = action.cooldownTime;
        this.settingsService.saveSettings(newSettings).then(() => {
            ctx.patchState({
                settings: newSettings
            });
        });
    }


}
