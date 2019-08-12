import {Concept} from './concept.model';
import {Action, NgxsOnInit, Selector, State, StateContext} from '@ngxs/store';
import {ChooseConceptToStudy, GoToConceptKey, LoadConcept, LoadConcepts, LoadTopLevelConcepts, NavigatedToConcept} from './concept.actions';
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
        const state = ctx.getState();
        const conceptTitle = action.conceptKey;
        if (state.conceptMap[conceptTitle]) {
            return;
        }
        return this.conceptsService.fetchConcept(conceptTitle).pipe(
            tap(concept => {
                const updatedConcepts = {...state.conceptMap};
                updatedConcepts[conceptTitle] = concept;
                ctx.patchState({
                    conceptMap: updatedConcepts
                });
            })
        );
    }

    @Action(NavigatedToConcept)
    navigatedToConcept(ctx: StateContext<ConceptStateModel>, action: NavigatedToConcept) {
        return ctx.dispatch(new LoadConcepts(action.concept.foundationKeys));
    }

    @Action(GoToConceptKey)
    goToConceptKey(ctx: StateContext<ConceptStateModel>, action: GoToConceptKey) {
        const concept = ctx.getState().conceptMap[(action.conceptKey)];
        return ctx.dispatch(new NavigatedToConcept(concept));
    }

    @Action(ChooseConceptToStudy)
    chooseConceptToStudy(ctx: StateContext<ConceptStateModel>, action: ChooseConceptToStudy) {
        ctx.patchState({
            conceptToStudyKey: action.concept.key
        });
    }
}
