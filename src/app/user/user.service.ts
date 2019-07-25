import { Concept } from './../concepts/concept.model';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { Injectable } from '@angular/core';
import { switchMap, first } from 'rxjs/operators';
import { of, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private afAuth: AngularFireAuth,
    private db: AngularFirestore
  ) { }

  public createUserInDbIfNotYetExisting(): Observable<any> {
    const userDocument = this.db.collection('users').doc(this.afAuth.auth.currentUser.uid);
    return userDocument.get().pipe(switchMap(snap => {
      if (snap.exists) {
        return null;
      }
      return userDocument.set({});
    }), first());
  }

  public chooseConcept(concept: Concept): Observable<any> {
    const userDocument = this.db.collection('users').doc(this.afAuth.auth.currentUser.uid);
    return userDocument.get().pipe(switchMap(snap => {
      return userDocument.set({
        chosenConcept: `/concepts/${concept.id}`
      });
    }), first());
  }
}
