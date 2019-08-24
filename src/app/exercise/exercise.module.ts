import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterModule, Routes} from '@angular/router';

import {IonicModule} from '@ionic/angular';

import {ExercisePage} from './exercise.page';
import {TermPromptComponent} from './term-prompt/term-prompt.component';
import {ExplanationComponent} from './explanation/explanation.component';
import {ExerciseTypeUnknownComponent} from './exercise-type-unknown/exercise-type-unknown.component';
import {MoreRequestedComponent} from './more-requested/more-requested.component';

const routes: Routes = [
    {
        path: '',
        component: ExercisePage
    },
    {
        path: ':conceptKey',
        component: ExercisePage
    }
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        RouterModule.forChild(routes),
        ReactiveFormsModule
    ],
    declarations: [
        ExercisePage,
        TermPromptComponent,
        ExplanationComponent,
        ExercisePage,
        ExerciseTypeUnknownComponent,
        MoreRequestedComponent
    ],
    entryComponents: [
        MoreRequestedComponent
    ]
})
export class ExercisePageModule {
}
