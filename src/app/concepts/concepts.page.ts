import { map, switchMap, filter } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { ConceptsService } from './concepts.service';
import { Concept } from './concept.model';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { UserService } from '../user/user.service';
import {Select, Store} from '@ngxs/store';
import {ConceptState} from './concept.state';
import {LoadConcept, LoadTopLevelConcepts} from './concept.actions';

@Component({
  selector: 'app-concepts',
  templateUrl: './concepts.page.html',
  styleUrls: ['./concepts.page.scss'],
})
export class ConceptsPage implements OnInit, OnDestroy {

  @Select(ConceptState.topLevelConcepts) topLevelConcepts$: Observable<Concept[]>;

  constructor(
    private store: Store
  ) { }

  ngOnDestroy(): void { }

  ngOnInit() {
    this.store.dispatch(new LoadTopLevelConcepts());
  }
}
