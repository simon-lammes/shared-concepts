import { map, switchMap, filter } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { ConceptsService } from './concepts.service';
import { Concept } from './concept.model';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { UserService } from '../user/user.service';

@Component({
  selector: 'app-concepts',
  templateUrl: './concepts.page.html',
  styleUrls: ['./concepts.page.scss'],
})
export class ConceptsPage implements OnInit, OnDestroy {

  concepts$: Observable<Concept[]>;
  inspectedConcept$: Observable<Concept>;
  title$: Observable<String>;

  constructor(
    private conceptSercice: ConceptsService,
    private route: ActivatedRoute,
    private userService: UserService,
    private router: Router
  ) { }

  ngOnDestroy(): void { }

  ngOnInit() {
    this.conceptSercice.topLevelConcepts$.subscribe();
    this.conceptSercice.loadTopLevelConcepts().subscribe();
    this.inspectedConcept$ = this.route.paramMap
      .pipe(
        switchMap(paramMap => {
          const conceptTitle = paramMap.get('conceptTitle');
          console.log(conceptTitle);
          if (!conceptTitle) {
            return of(undefined);
          }
          return this.conceptSercice.loadConceptByTitle(conceptTitle);
        }),
        untilDestroyed(this)
      );
    this.inspectedConcept$.subscribe(inspectedConcept => {
      if (!inspectedConcept) {
        this.concepts$ = this.conceptSercice.topLevelConcepts$;
      } else {
        this.concepts$ = this.conceptSercice.concepts$;
        this.conceptSercice.loadFoundationConcepts(inspectedConcept);
      }
    })
    this.title$ = this.inspectedConcept$
      .pipe(
        switchMap(inspectedConcept => {
          if (!inspectedConcept) {
            return "Whatever";
          }
          console.log(inspectedConcept);
          return inspectedConcept.title;
        }),
        untilDestroyed(this)
      );
  }
}
