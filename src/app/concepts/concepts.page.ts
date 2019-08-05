import {first} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {Concept, getKeyForConcept} from './concept.model';
import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Select, Store} from '@ngxs/store';
import {ConceptState} from './concept.state';
import {GoToConceptKey, LoadTopLevelConcepts} from './concept.actions';

@Component({
    selector: 'app-concepts',
    templateUrl: './concepts.page.html',
    styleUrls: ['./concepts.page.scss'],
})
export class ConceptsPage implements OnInit, OnDestroy {

    @Select(ConceptState.displayedConcepts) topLevelConcepts$: Observable<Concept[]>;

    constructor(
        private store: Store,
        private route: ActivatedRoute
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
}
