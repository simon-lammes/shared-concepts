import {first} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {Concept, getKeyForConcept} from './concept.model';
import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Select, Store} from '@ngxs/store';
import {ConceptState} from './concept.state';
import {GoToConceptKey, LoadTopLevelConcepts} from './concept.actions';

@Component({
    selector: 'app-concepts',
    templateUrl: './concepts.page.html',
    styleUrls: ['./concepts.page.scss'],
})
export class ConceptsPage implements OnInit, OnDestroy {

    @Select(ConceptState.displayedConcepts) displayedConcepts$: Observable<Concept[]>;
    @Select(ConceptState.inspectedConcept) inspectedConcept$: Observable<Concept>;

    constructor(
        private store: Store,
        private route: ActivatedRoute,
        private router: Router
    ) {
    }

    ngOnDestroy(): void {
    }

    ngOnInit() {
        this.store.dispatch(new LoadTopLevelConcepts());
    }

    ionViewWillEnter() {
        this.route.paramMap.pipe(first()).subscribe(paramMap => {
            const conceptKey = paramMap.get('conceptKey');
            return this.store.dispatch(new GoToConceptKey(conceptKey));
        });
    }

    getKeyForConcept(concept: Concept) {
        return getKeyForConcept(concept);
    }

    studyConcept(inspectedConcept: Concept) {
        this.router.navigateByUrl('/exercise');
    }
}
