import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private afAuth: AngularFireAuth,
    private db: AngularFirestore
  ) { }

  public createUserInDbIfNotYetExisting() {
    const userDocument = this.db.collection('users').doc(this.afAuth.auth.currentUser.uid);
    userDocument.get().subscribe(snap => {
      console.log(snap);
      console.log(snap.exists);
      if (!snap.exists) {
        userDocument.set({});
      }
    });
  }
}
