import { AuthGuard } from './../auth/auth.guard';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ExercisePage } from './exercise.page';

const routes: Routes = [
  {
    path: '',
    component: ExercisePage,
    canLoad: [AuthGuard],
    canActivate: [AuthGuard]
  },
  {
    path: ':conceptId',
    component: ExercisePage,
    canLoad: [AuthGuard],
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ExercisePage]
})
export class ExercisePageModule {}
