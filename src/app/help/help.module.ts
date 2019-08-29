import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {RouterModule, Routes} from '@angular/router';
import {MatExpansionModule} from '@angular/material/expansion';
import {IonicModule} from '@ionic/angular';

import {HelpPage} from './help.page';

const routes: Routes = [
    {
        path: '',
        component: HelpPage
    }
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        RouterModule.forChild(routes),
        MatExpansionModule
    ],
    declarations: [HelpPage]
})
export class HelpPageModule {
}
