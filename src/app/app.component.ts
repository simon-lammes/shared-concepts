import {Router} from '@angular/router';
import {map} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {AngularFireAuth} from '@angular/fire/auth';
import {Component, OnDestroy, OnInit} from '@angular/core';

import {AlertController, Platform} from '@ionic/angular';
import {SplashScreen} from '@ionic-native/splash-screen/ngx';
import {StatusBar} from '@ionic-native/status-bar/ngx';
import {untilDestroyed} from 'ngx-take-until-destroy';

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html'
})
export class AppComponent implements OnInit, OnDestroy {
    pictureUrl$: Observable<string>;
    displayName$: Observable<string>;
    isLoggedIn$: Observable<boolean>;

    constructor(
        private platform: Platform,
        private splashScreen: SplashScreen,
        private statusBar: StatusBar,
        private afAuth: AngularFireAuth,
        private router: Router,
        private alertController: AlertController
    ) {
        this.initializeApp();
    }

    ngOnDestroy(): void {
    }

    initializeApp() {
        this.platform.ready().then(() => {
            this.statusBar.styleDefault();
            this.splashScreen.hide();
        });
    }

    ngOnInit() {
        this.pictureUrl$ = this.afAuth.authState
            .pipe(
                map(user => {
                    return user ? user.photoURL : null;
                }),
                untilDestroyed(this)
            );
        this.displayName$ = this.afAuth.authState
            .pipe(
                map(user => {
                    return user ? user.displayName : null;
                }),
                untilDestroyed(this)
            );
        this.isLoggedIn$ = this.afAuth.authState
            .pipe(
                map(user => !!user),
                untilDestroyed(this)
            );
    }

    async logout() {
        const alert = await this.alertController.create({
            header: 'Logout',
            message: 'Are you sure you want to log yourself out?',
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel',
                    cssClass: 'secondary'
                }, {
                    text: 'Yes, logout',
                    handler: () => {
                        this.afAuth.auth.signOut();
                    }
                }
            ]
        });
        await alert.present();
    }

    login() {
        sessionStorage.setItem('redirectUrl', this.router.url);
        this.router.navigateByUrl('/auth');
    }

    goToConcepts() {
        this.router.navigateByUrl('/concepts');
    }

    goToExercise() {
        this.router.navigateByUrl('/exercise');
    }
}
