import {Concept} from './concept.model';
import {Action, NgxsOnInit, Selector, State, StateContext} from '@ngxs/store';
import {ChooseConceptToStudy, LoadConcept, LoadConcepts, LoadTopLevelConcepts, NavigatedToConceptKey} from './concept.actions';
import {ConceptsService} from './concepts.service';
import {concatMap, switchMap, tap} from 'rxjs/operators';
import {of} from 'rxjs';

export interface ConceptStateModel {
    conceptMap: {
        [key: string]: Concept
    };
    topLevelConceptKeys: string[];
    conceptToStudyKey: string;
}

@State<ConceptStateModel>({
    name: 'concepts',
    defaults: {
        conceptMap: {},
        topLevelConceptKeys: [],
        conceptToStudyKey: undefined
    }
})
export class ConceptState implements NgxsOnInit {

    constructor(private conceptsService: ConceptsService) {
    }

    @Selector()
    static conceptMap(state: ConceptStateModel): { [key: string]: Concept } {
        return state.conceptMap;
    }

    @Selector()
    static topLevelConceptsKeys(state: ConceptStateModel): string[] {
        return state.topLevelConceptKeys;
    }


    @Selector()
    static topLevelConcepts(state: ConceptStateModel): Concept[] {
        return state.topLevelConceptKeys.map(key => state.conceptMap[key]).filter(concept => !!concept);
    }

    @Selector()
    static conceptToStudy(state: ConceptStateModel): Concept {
        return state.conceptMap[state.conceptToStudyKey];
    }

    @Selector([ConceptState.conceptToStudy])
    static conceptToExerciseNext(state: ConceptStateModel, conceptToStudy: Concept): Concept {
        return conceptToStudy;
    }

    ngxsOnInit(ctx: StateContext<ConceptStateModel>) {
        ctx.dispatch(new LoadTopLevelConcepts());
    }

    @Action(LoadTopLevelConcepts)
    loadTopLevelConcepts(ctx: StateContext<ConceptStateModel>) {
        const state = ctx.getState();
        if (state.topLevelConceptKeys.length > 0) {
            return ctx.dispatch(new LoadConcepts(state.topLevelConceptKeys));
        }
        return this.conceptsService.fetchTopLevelKeys().pipe(
            tap(topLevelConceptKeys => {
                ctx.patchState({
                    topLevelConceptKeys
                });
                return ctx.dispatch(new LoadConcepts(topLevelConceptKeys));
            })
        );
    }

    @Action(LoadConcepts)
    loadConcepts(ctx: StateContext<ConceptStateModel>, action: LoadConcepts) {
        return of(action.conceptKeys)
            .pipe(
                switchMap(keys => keys),
                concatMap(key => ctx.dispatch(new LoadConcept(key)))
            );
    }

    @Action(LoadConcept)
    loadConcept(ctx: StateContext<ConceptStateModel>, action: LoadConcept) {
        const conceptAlreadyCached = ctx.getState().conceptMap[action.conceptKey];
        if (conceptAlreadyCached) {
            return;
        }
        return this.conceptsService.fetchConcept(action.conceptKey).pipe(
            tap(concept => {
                return ctx.patchState({
                    conceptMap: {
                        ...ctx.getState().conceptMap,
                        [concept.key]: concept
                    }
                });
            })
        );
    }

    @Action(NavigatedToConceptKey)
    navigatedToConceptKey(ctx: StateContext<ConceptStateModel>, action: NavigatedToConceptKey) {
        const conceptNavigatedTo = ctx.getState().conceptMap[(action.conceptKey)];
        // If the concept we navigated to already is cached, we only need to worry about fetching its foundations ...
        if (conceptNavigatedTo) {
            return ctx.dispatch(new LoadConcepts(conceptNavigatedTo.foundationKeys));
        }
        // ... otherwise we have to fetch the concept we navigated to first, before fetching its foundations.
        return this.conceptsService.fetchConcept(action.conceptKey)
            .pipe(
                tap(concept => {
                    ctx.patchState({
                        conceptMap: {
                            ...ctx.getState().conceptMap,
                            [concept.key]: concept
                        }
                    });
                    return ctx.dispatch(new LoadConcepts(concept.foundationKeys));
                })
            );
    }

    @Action(ChooseConceptToStudy)
    chooseConceptToStudy(ctx: StateContext<ConceptStateModel>, action: ChooseConceptToStudy) {
        ctx.patchState({
            conceptToStudyKey: action.concept.key
        });
    }
}
