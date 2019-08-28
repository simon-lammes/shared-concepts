import {AuthGuard} from './auth/auth.guard';
import {NgModule} from '@angular/core';
import {PreloadAllModules, RouterModule, Routes} from '@angular/router';

const routes: Routes = [
    {
        path: '',
        redirectTo: 'concepts',
        pathMatch: 'full'
    },
    {
        path: 'home',
        loadChildren: './home/home.module#HomePageModule'
    },
    {
        path: 'concepts',
        loadChildren: './concepts/concepts.module#ConceptsPageModule',
    },
    {
        path: 'exercise',
        loadChildren: './exercise/exercise.module#ExercisePageModule',
        canLoad: [AuthGuard],
        canActivate: [AuthGuard]
    },
    {
        path: 'auth',
        loadChildren: './auth/auth.module#AuthPageModule'
    },
    {
        path: 'settings',
        loadChildren: './settings/settings.module#SettingsPageModule'
    },
    {
        path: 'help',
        loadChildren: './help/help.module#HelpPageModule'
    },
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes, {preloadingStrategy: PreloadAllModules})
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
