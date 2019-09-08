import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterModule, Routes} from '@angular/router';

import {IonicModule} from '@ionic/angular';

import {ConceptsPage} from './concepts.page';
import {AddConceptComponent} from './add-concept/add-concept.component';

const routes: Routes = [
    {
        path: '',
        component: ConceptsPage
    },
    {
        path: ':conceptKey',
        component: ConceptsPage,
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
        ConceptsPage,
        AddConceptComponent
    ]
})
export class ConceptsPageModule {
}
