import {Concept} from './concept.model';
import {Action, Selector, State, StateContext, Store} from '@ngxs/store';
import {LoadConcept, LoadConcepts, LoadTopLevelConcepts} from './concept.actions';
import {ConceptsService} from './concepts.service';
import {concatMap, first, map, mergeMap, switchMap, tap} from 'rxjs/operators';
import {of} from 'rxjs';

export interface ConceptStateModel {
    concepts: {
        [key: string]: Concept
    };
    topLevelConceptKeys: string[];
}

@State<ConceptStateModel>({
    name: 'concepts',
    defaults: {
        concepts: {},
        topLevelConceptKeys: [],
    }
})
export class ConceptState {

    constructor(private conceptsService: ConceptsService, private store: Store) {}

    @Selector()
    static topLevelConcepts(state: ConceptStateModel): Concept[] {
        return state.topLevelConceptKeys.map(key => state.concepts[key]).filter(concept => !!concept);
    }

    @Action(LoadTopLevelConcepts)
    loadTopLevelConcepts(ctx: StateContext<ConceptStateModel>, action: LoadTopLevelConcepts) {
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
        if (state.concepts[conceptTitle]) {
            return;
        }
        return this.conceptsService.fetchConcept(conceptTitle).pipe(
            tap(concept => {
                const updatedConcepts = {...state.concepts};
                updatedConcepts[conceptTitle] = concept;
                ctx.patchState({
                    concepts: updatedConcepts
                });
            })
        );
    }
}
