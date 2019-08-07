import {Router} from '@angular/router';
import {map} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {AngularFireAuth} from '@angular/fire/auth';
import {Component, OnInit} from '@angular/core';

import {Platform} from '@ionic/angular';
import {SplashScreen} from '@ionic-native/splash-screen/ngx';
import {StatusBar} from '@ionic-native/status-bar/ngx';

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html'
})
export class AppComponent implements OnInit {

    pictureUrl$: Observable<string>;
    displayName$: Observable<string>;
    isLoggedIn$: Observable<boolean>;

    constructor(
        private platform: Platform,
        private splashScreen: SplashScreen,
        private statusBar: StatusBar,
        private afAuth: AngularFireAuth,
        private router: Router
    ) {
        this.initializeApp();
    }

    initializeApp() {
        this.platform.ready().then(() => {
            this.statusBar.styleDefault();
            this.splashScreen.hide();
        });
    }

    ngOnInit() {
        this.pictureUrl$ = this.afAuth.authState.pipe(map(user => {
            return user ? user.photoURL : null;
        }));
        this.displayName$ = this.afAuth.authState.pipe(map(user => {
            return user ? user.displayName : null;
        }));
        this.isLoggedIn$ = this.afAuth.authState.pipe(map(user => !!user));
    }

    logout() {
        this.afAuth.auth.signOut();
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
