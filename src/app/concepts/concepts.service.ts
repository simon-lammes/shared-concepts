import { switchMap, map, mergeMap, concatMap, tap, first, take, timeout } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Concept } from './concept.model';
import { Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ConceptsService {

  constructor(private http: HttpClient) { }

  fetchTopLevelKeys(): Observable<string[]> {
    return this.http.get<{ topLevelConceptTitles: string[] }>(environment.exerciseURL + '/Concepts/base.json')
        .pipe(map(response => {
          return response.topLevelConceptTitles;
        }));
  }

  fetchConcept(conceptKey: string): Observable<Concept> {
    return this.http.get<Concept>(environment.exerciseURL + `/Concepts/${conceptKey}/base.json`);
  }
}
