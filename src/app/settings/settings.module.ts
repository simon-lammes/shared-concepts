import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {RouterModule, Routes} from '@angular/router';

import {IonicModule} from '@ionic/angular';

import {SettingsPage} from './settings.page';
import {HelpModalComponent} from '../help-modal/help-modal.component';
import {HelpModalModule} from '../help-modal/help-modal.module';

const routes: Routes = [
    {
        path: '',
        component: SettingsPage
    }
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        RouterModule.forChild(routes),
        HelpModalModule
    ],
    declarations: [
        SettingsPage
    ],
    entryComponents: [
        HelpModalComponent
    ]
})
export class SettingsPageModule {
}
