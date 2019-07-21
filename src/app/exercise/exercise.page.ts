import { ExerciseService } from './exercise.service';
import { Observable, of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Concept } from '../concepts/concept.model';
import { Exercise } from './exercise.model';
import { switchMap } from 'rxjs/operators';
import { untilDestroyed } from 'ngx-take-until-destroy';

@Component({
  selector: 'app-exercise',
  templateUrl: './exercise.page.html',
  styleUrls: ['./exercise.page.scss'],
})
export class ExercisePage implements OnInit, OnDestroy {
  concept$: Observable<Concept>;
  exercises$: Observable<Exercise[]>

  constructor(
    private activatedRoute: ActivatedRoute,
    private exerciseService: ExerciseService,
  ) { }
  
  ngOnDestroy(){}

  ngOnInit() {
    this.exercises$ = this.activatedRoute.paramMap.pipe(switchMap(paramMap => {
      const conceptId = paramMap.get('conceptId');
      if (!conceptId) {
        throw new Error('Missing concept id');
      }
      return this.exerciseService.loadAllExercisesForConceptId(conceptId);
    }), untilDestroyed(this));
  }

}
