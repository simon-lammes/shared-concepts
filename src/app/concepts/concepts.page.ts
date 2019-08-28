import {map, withLatestFrom} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {Concept} from './concept.model';
import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Select, Store} from '@ngxs/store';
import {ConceptState} from './concept.state';
import {ChooseConceptToStudy, LoadTopLevelConcepts, NavigatedToConceptKey} from './concept.actions';
import {showHelpModalForConceptsPage} from './concepts.help';
import {ModalController} from '@ionic/angular';

@Component({
    selector: 'app-concepts',
    templateUrl: './concepts.page.html',
    styleUrls: ['./concepts.page.scss'],
})
export class ConceptsPage implements OnInit, OnDestroy {

    @Select(ConceptState.conceptMap) conceptMap$: Observable<{ [key: string]: Concept }>;
    @Select(ConceptState.topLevelConceptsKeys) topLevelConceptKeys$: Observable<string[]>;
    displayedConcepts$: Observable<Concept[]>;
    inspectedConcept$: Observable<Concept>;

    constructor(
        private store: Store,
        private route: ActivatedRoute,
        private router: Router,
        private modalController: ModalController
    ) {
    }

    ngOnDestroy(): void {
    }

    ngOnInit() {
        const conceptKey = this.route.snapshot.paramMap.get('conceptKey');
        if (conceptKey) {
            this.store.dispatch(new NavigatedToConceptKey(conceptKey));
        } else {
            this.store.dispatch(new LoadTopLevelConcepts());
        }
        this.inspectedConcept$ = this.conceptMap$.pipe(
            map(conceptMap => {
                return conceptMap[conceptKey];
            })
        );
        this.displayedConcepts$ = this.conceptMap$.pipe(
            withLatestFrom(this.inspectedConcept$, this.topLevelConceptKeys$),
            map(([conceptMap, inspectedConcept, topLevelConceptKeys]) => {
                if (!inspectedConcept) {
                    return topLevelConceptKeys.map(key => conceptMap[key]).filter(concept => !!concept);
                }
                return inspectedConcept.foundationKeys.map(key => conceptMap[key]).filter(concept => !!concept);
            })
        );
    }

    studyConcept(chosenConcept: Concept) {
        this.store.dispatch(new ChooseConceptToStudy(chosenConcept));
        this.router.navigateByUrl('/exercise');
    }

    onHelpRequested() {
        showHelpModalForConceptsPage(this.modalController);
    }
}
