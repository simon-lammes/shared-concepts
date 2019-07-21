import { map, first } from 'rxjs/operators';
import { Exercise } from './exercise.model';
import { Observable } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import { Injectable } from '@angular/core';
import { convertSnaps } from '../db-utils';

@Injectable({
  providedIn: 'root'
})
export class ExerciseService {

  constructor(private db: AngularFirestore) { }

  loadAllExercisesForConceptId(conceptId: string): Observable<Exercise[]> {
    console.log(conceptId);
    return this.db.collection(`concepts/${conceptId}/exercises`)
      .snapshotChanges()
      .pipe(
        map(snaps => {
          console.log(snaps);
          return convertSnaps<Exercise>(snaps);
        }),
        first()
      );
  }
}
