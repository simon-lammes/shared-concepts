import {Concept} from './concept.model';
import {Action, Selector, State, StateContext} from '@ngxs/store';
import {GoToConcept, GoToConceptKey, LoadConcept, LoadConcepts, LoadTopLevelConcepts} from './concept.actions';
import {ConceptsService} from './concepts.service';
import {concatMap, switchMap, tap} from 'rxjs/operators';
import {of} from 'rxjs';

export interface ConceptStateModel {
    conceptMap: {
        [key: string]: Concept
    };
    topLevelConceptKeys: string[];
    inspectedConcept: Concept;
}

@State<ConceptStateModel>({
    name: 'concepts',
    defaults: {
        conceptMap: {},
        topLevelConceptKeys: [],
        inspectedConcept: undefined,
    }
})
export class ConceptState {

    constructor(private conceptsService: ConceptsService) {
    }

    @Selector()
    static displayedConcepts(state: ConceptStateModel): Concept[] {
        if (!state.inspectedConcept) {
            return state.topLevelConceptKeys.map(key => state.conceptMap[key]).filter(concept => !!concept);
        }
        if (!state.inspectedConcept.foundations) {
            return [];
        }
        return state.inspectedConcept.foundations.map(key => state.conceptMap[key]).filter(concept => !!concept);
    }

    @Selector()
    static topLevelConcepts(state: ConceptStateModel): Concept[] {
        return state.topLevelConceptKeys.map(key => state.conceptMap[key]).filter(concept => !!concept);
    }

    @Action(LoadTopLevelConcepts)
    loadTopLevelConcepts(ctx: StateContext<ConceptStateModel>) {
        const state = ctx.getState();
        if (state.topLevelConceptKeys.length > 0) {
            return;
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

    @Action(GoToConcept)
    goToConcept(ctx: StateContext<ConceptStateModel>, action: GoToConcept) {
        const inspectedConcept = action.concept;
        ctx.patchState({
            inspectedConcept
        });
        return ctx.dispatch(new LoadConcepts(inspectedConcept.foundations));
    }

    @Action(GoToConceptKey)
    goToConceptKey(ctx: StateContext<ConceptStateModel>, action: GoToConceptKey) {
        const concept = ctx.getState().conceptMap[(action.conceptKey)];
        if (!concept) {
            return ctx.patchState({
                inspectedConcept: undefined
            });
        }
        return ctx.dispatch(new GoToConcept(concept));
    }
}
