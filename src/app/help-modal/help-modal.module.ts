import {HelpModalComponent} from './help-modal.component';
import {NgModule} from '@angular/core';
import {IonicModule} from '@ionic/angular';
import {CommonModule} from '@angular/common';

@NgModule({
    declarations: [
        HelpModalComponent
    ],
    imports: [
        IonicModule,
        CommonModule
    ],
    entryComponents: [
        HelpModalComponent
    ]
})
export class HelpModalModule {
}
