import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ConceptsPage } from './concepts.page';

const routes: Routes = [
  {
    path: '',
    component: ConceptsPage
  },
  {
    path: ':conceptId',
    component: ConceptsPage,
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ConceptsPage]
})
export class ConceptsPageModule {}
