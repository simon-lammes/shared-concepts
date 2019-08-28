import {SpinnerComponent} from './spinner/spinner.component';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IonicModule} from '@ionic/angular';

@NgModule({
    exports: [
        SpinnerComponent
    ],
    imports: [
        CommonModule,
        IonicModule
    ],
    declarations: [SpinnerComponent]
})
export class SharedModule { }
