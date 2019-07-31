import { switchMap, map, mergeMap, concatMap, tap, first, take, timeout } from 'rxjs/operators';
import { environment } from './../../environments/environment';
import { Concept } from './concept.model';
import { Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ConceptsService {
  private _topLevelConcepts = new BehaviorSubject<Concept[]>([]);
  private topLevelConceptsCache: Concept[] = [];
  private _concepts = new BehaviorSubject<Concept[]>([]);
  private conceptsCache: Concept[] = [];

  get topLevelConcepts$() {
    return this._topLevelConcepts.asObservable();
  }

  get concepts$() {
    return this._concepts.asObservable();
  }

  constructor(private http: HttpClient) { }

  loadTopLevelConcepts() {
    const topLevelConceptsAreLoadedAlready = this.conceptsCache.length > 0;
    if (topLevelConceptsAreLoadedAlready) {
      return of(undefined);
    }
    return this.http.get<{ topLevelConceptTitles: string[] }>(environment.exerciseURL + '/Concepts/base.json')
      .pipe(
        first(),
        switchMap(response => {
          console.log("1");
          return response.topLevelConceptTitles;
        }),
        concatMap(conceptTitle => {
          console.log("2");
          return this.http.get<Concept>(environment.exerciseURL + `/Concepts/${conceptTitle}/base.json`);
        }),
        tap(concept => {
          console.log("3");
          const conceptIsAlreadyPartOfTopLevelConceptsCache = 
            this.topLevelConceptsCache.some(x => x.title === concept.title);
          const conceptIsAlreadyPartOfConceptsCache = 
            this.conceptsCache.some(x => x.title === concept.title);
          if (!conceptIsAlreadyPartOfTopLevelConceptsCache) {
            this.topLevelConceptsCache.push(concept);
            this._topLevelConcepts.next(this.topLevelConceptsCache);
          }
          if (!conceptIsAlreadyPartOfConceptsCache) {
            this.conceptsCache.push(concept);
          this._concepts.next(this.conceptsCache);
          }
        })
      );
  }

  loadFoundationConcepts(concept: Concept) {
    for (var foundationConceptTitle in concept.foundations) {
      const foundationConceptHasAlreadyBeenLoaded = this.conceptsCache
        .some(concept => concept.title === foundationConceptTitle);
      if (foundationConceptHasAlreadyBeenLoaded) {
        continue;
      }
      this.http.get<Concept>(environment.exerciseURL + `/Concepts/${concept.title}/base.json`)
        .pipe(
          first(),
          tap(concept => {
            this.conceptsCache.push(concept);
            this._concepts.next(this.conceptsCache);
          })
        );
    }
  }

  loadConceptByTitle(conceptTitle: string) {
    console.log(this.conceptsCache);
    var alreadyLoadedResult = this.conceptsCache.find(concept => concept.title === conceptTitle);
    console.log(alreadyLoadedResult);
    if (alreadyLoadedResult) {
      return of(alreadyLoadedResult);
    }
    return this.http.get<Concept>(environment.exerciseURL + `/Concepts/${conceptTitle}/base.json`)
      .pipe(
        first(),
        tap(concept => {
          this.conceptsCache.push(concept);
          this._topLevelConcepts.next(this.conceptsCache);
        })
      );
  }
}
