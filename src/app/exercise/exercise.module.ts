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
import {MultipleResponseQuestionComponent} from './multiple-response-question/multiple-response-question.component';
import {MarkdownModule} from 'ngx-markdown';

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
        ReactiveFormsModule,
        MarkdownModule.forRoot()
    ],
    declarations: [
        ExercisePage,
        TermPromptComponent,
        ExplanationComponent,
        ExercisePage,
        ExerciseTypeUnknownComponent,
        MoreRequestedComponent,
        MultipleResponseQuestionComponent
    ],
    entryComponents: [
        MoreRequestedComponent
    ]
})
export class ExercisePageModule {
}
