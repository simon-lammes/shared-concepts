import { Component, OnInit, NgZone, OnDestroy } from '@angular/core';
import * as firebase from 'firebase/app';
import * as firebaseui from 'firebaseui';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit, OnDestroy {

  ui: firebaseui.auth.AuthUI;
  uiConfig: any;

  constructor(
    private afAuth: AngularFireAuth,
    private router: Router,
    private ngZone: NgZone
  ) { }

  ngOnDestroy() {
    this.ui.delete();
  }

  ngOnInit() {
    this.uiConfig = {
      signInOptions: [
        firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        firebase.auth.EmailAuthProvider.PROVIDER_ID
      ],
      callbacks: {
        signInSuccessWithAuthResult: this
          .onLoginSuccessful
          .bind(this)
      }
    }
    this.ui = new firebaseui.auth.AuthUI(this.afAuth.auth);
  }

  ionViewWillEnter() {
    this.ui.start('#auth-container', this.uiConfig);
  }

  onLoginSuccessful() {
    this.router.navigateByUrl('/concepts');
    // The redirectUrl has to be stored in local storage.
    // Otherwise it would get lost during authentication using Google
    const redirectUrl = sessionStorage.getItem('redirectUrl');
    // Angular cannot know by itself that this method changes the view, 
    // so we need to execute it inside the angular zone
    this.ngZone.run(() => this.router.navigateByUrl(redirectUrl));
  }

}
