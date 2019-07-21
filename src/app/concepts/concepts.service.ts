import { Concept } from './concept.model';
import { AngularFirestore } from '@angular/fire/firestore';
import { Injectable } from '@angular/core';
import { Observable, ObservableLike } from 'rxjs';
import { first, map } from 'rxjs/operators';
import { convertSnaps } from '../db-utils';

@Injectable({
  providedIn: 'root'
})
export class ConceptsService {

  constructor(private db: AngularFirestore) { }

  loadAllConcepts(): Observable<Concept[]> {
    return this.db.collection('concepts')
      .snapshotChanges()
      .pipe(
        map(snaps => {
          return convertSnaps<Concept>(snaps);
        }),
        first()
      );
  }

  findConceptByUrl(conceptId: string): Observable<Concept> {
    return this.db.collection('concepts').doc(conceptId).get()
      .pipe(
        map(documentSnapshot => {
          return <Concept>{
            id: conceptId,
            ...documentSnapshot.data()
          }
        }),
        first()
      )
  }
}
