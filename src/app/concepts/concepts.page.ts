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

  inspectedConcept$: Observable<Concept>;
  concepts$: Observable<Concept[]>;
  showConcepts$: Observable<Concept[]>;
  title$: Observable<String>;

  constructor(
    private conceptSercice: ConceptsService,
    private route: ActivatedRoute,
    private userService: UserService,
    private router: Router
  ) { }

  ngOnDestroy(): void {}

  ngOnInit() {
    this.concepts$ = this.conceptSercice.loadAllConcepts();
    this.concepts$.pipe(untilDestroyed(this)).subscribe();

    this.inspectedConcept$ = this.route.paramMap.pipe(switchMap(paramMap => {
      const conceptId = paramMap.get('conceptId');
      if (!conceptId) {
        return of(undefined);
      }
      return this.conceptSercice.findConceptByUrl(conceptId);
    }), untilDestroyed(this));

    this.showConcepts$ = this.inspectedConcept$.pipe(switchMap(inspectedConcept => {
      if (!inspectedConcept) {
        return this.concepts$;
      }
      return this.concepts$.pipe(map(concepts => {
        return concepts.filter(concept => {
          if (!concept.foundationFor) {
            return false;
          }
          return concept.foundationFor.some(ref => {
            return ref.id == inspectedConcept.id;
          });
        });
      }), untilDestroyed(this))
    }))

    this.title$ = this.inspectedConcept$.pipe(map(concept => {
      if (!concept) {
        return 'Top Level Concepts';
      }
      return `Foundations for: ${concept.title}`;
    }), untilDestroyed(this));
  }

  chooseConcept(concept: Concept) {
    this.userService.chooseConcept(concept).subscribe(() => {
      this.router.navigateByUrl(`/exercise/${concept.id}`);
    });
  }
}
