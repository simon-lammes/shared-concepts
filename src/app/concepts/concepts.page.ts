import {map} from 'rxjs/operators';
import {combineLatest, Observable} from 'rxjs';
import {Concept} from './concept.model';
import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Select, Store} from '@ngxs/store';
import {ConceptState} from './concept.state';
import {ChooseConceptToStudy, NavigatedToConceptKey, TopLevelConceptsRequested} from './concept.actions';
import {LoadingController, ModalController} from '@ionic/angular';
import {environment} from '../../environments/environment.prod';
import {SettingsService} from '../settings/settings.service';
import {untilDestroyed} from 'ngx-take-until-destroy';

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
    imageUrlOfInspectedConcept$: Observable<string>;
    displayEditorMode: boolean;

    constructor(
        private store: Store,
        private route: ActivatedRoute,
        private router: Router,
        private modalController: ModalController,
        private loadingController: LoadingController,
        private settingsService: SettingsService
    ) {
    }

    ngOnDestroy(): void {
    }

    ngOnInit() {
        const conceptKey = this.route.snapshot.paramMap.get('conceptKey');
        if (conceptKey) {
            this.store.dispatch(new NavigatedToConceptKey(conceptKey));
        } else {
            this.store.dispatch(new TopLevelConceptsRequested());
        }
        this.inspectedConcept$ = this.conceptMap$.pipe(
            map(conceptMap => {
                return conceptMap[conceptKey];
            })
        );
        this.displayedConcepts$ = combineLatest([this.conceptMap$, this.inspectedConcept$, this.topLevelConceptKeys$]).pipe(
            map(([conceptMap, inspectedConcept, topLevelConceptKeys]) => {
                if (!inspectedConcept) {
                    return topLevelConceptKeys.map(key => conceptMap[key]).filter(concept => !!concept);
                }
                return inspectedConcept.foundationKeys.map(key => conceptMap[key]).filter(concept => !!concept);
            })
        );
        this.imageUrlOfInspectedConcept$ = this.inspectedConcept$.pipe(
            map(concept => {
                if (!concept || !concept.imageKey) {
                    return undefined;
                }
                return `${environment.exerciseURL}/Images/${concept.imageKey}`;
            })
        );
        // In know that the following 3 lines of code are bad, because the "reactive" way is better.
        // But somehow chrome froze when I did it the right way.
        // I found no other way to fix it than to use this imparitive approach.
        this.settingsService.fetchSettingsForCurrentUser$().pipe(untilDestroyed(this)).subscribe(settings => {
            this.displayEditorMode = settings.editorMode;
        });
    }

    async studyConcept(chosenConcept: Concept) {
        const loadingElement = await this.loadingController.create({
            message: 'Preparing your exercises'
        });
        await loadingElement.present();
        this.store.dispatch(new ChooseConceptToStudy(chosenConcept));
        this.router.navigateByUrl('/exercise').then(() => {
            loadingElement.dismiss();
        });
    }
}
