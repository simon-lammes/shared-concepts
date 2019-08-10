import {Action, Selector, State, StateContext} from '@ngxs/store';
import {SharedConceptSettings, TimeSpan} from './settings.model';
import {CooldownTimeChanged} from './settings.actions';

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
export class SettingsState {

    @Selector()
    static currentSettings(state: SettingsStateModel): SharedConceptSettings {
        return state.settings;
    }

    @Action(CooldownTimeChanged)
    settingsChanged(ctx: StateContext<SettingsStateModel>, action: CooldownTimeChanged) {
        const newSettings = {...ctx.getState().settings};
        newSettings.cooldownTime = action.cooldownTime;
        ctx.patchState({
            settings: newSettings
        });
    }
}
