import {Concept} from './concept.model';
import {Action, Selector, State, StateContext} from '@ngxs/store';
import {
    ChooseConceptToStudy,
    ConceptDeleted,
    ConceptMarkedAsTopLevelConcept,
    ConceptUpserted,
    LoadConcept,
    LoadConcepts,
    LoadFoundationConceptsToStudyRecursively,
    NavigatedToConceptKey,
    TopLevelConceptsRequested
} from './concept.actions';
import {ConceptsService} from './concepts.service';
import {concatMap, map} from 'rxjs/operators';
import {of} from 'rxjs';
import {getArrayCopyWithoutValue} from '../shared/universal-helper.functions';

export interface ConceptStateModel {
    conceptMap: {
        [key: string]: Concept
    };
    topLevelConceptKeys: string[];
    mainConceptToStudyKey: string;
    allConceptsToStudyKeys: {
        [key: string]: boolean
    };
}

@State<ConceptStateModel>({
    name: 'concepts',
    defaults: {
        conceptMap: {},
        topLevelConceptKeys: [],
        mainConceptToStudyKey: undefined,
        allConceptsToStudyKeys: {}
    }
})
export class ConceptState {

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
    static mainConceptToStudy(state: ConceptStateModel): Concept {
        return state.conceptMap[state.mainConceptToStudyKey];
    }

    @Selector()
    static allConceptsToStudyKeys(state: ConceptStateModel): string[] {
        return Object.keys(state.allConceptsToStudyKeys);
    }

    @Action(TopLevelConceptsRequested)
    topLevelConceptsRequested(ctx: StateContext<ConceptStateModel>) {
        const state = ctx.getState();
        if (state.topLevelConceptKeys.length > 0) {
            return ctx.dispatch(new LoadConcepts(state.topLevelConceptKeys));
        }
        return this.conceptsService.fetchTopLevelKeys().pipe(
            map(topLevelConceptKeys => {
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
                concatMap(keys => keys),
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
            map(concept => {
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
                map(concept => {
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
        ctx.setState({
            ...ctx.getState(),
            mainConceptToStudyKey: action.concept.key,
            // the old concepts to study keys are no longer valid and have to be removed
            allConceptsToStudyKeys: undefined,
        });
        return ctx.dispatch(new LoadFoundationConceptsToStudyRecursively(action.concept));
    }

    @Action(LoadFoundationConceptsToStudyRecursively)
    loadFoundationConceptsToStudyRecursively(ctx: StateContext<ConceptStateModel>, action: LoadFoundationConceptsToStudyRecursively) {
        ctx.patchState({
            allConceptsToStudyKeys: {
                ...ctx.getState().allConceptsToStudyKeys,
                [action.concept.key]: true
            }
        });
        if (!action.concept.foundationKeys) {
            return;
        }
        const keys$ = of(action.concept.foundationKeys);
        return keys$.pipe(
            concatMap(keys => keys),
            concatMap(key => {
                const cachedConcept = ctx.getState().conceptMap[key];
                if (cachedConcept) {
                    return of(cachedConcept);
                }
                return this.conceptsService.fetchConcept(key);
            }),
            map(concept => {
                const conceptIsNotYetCached = !ctx.getState().conceptMap[concept.key];
                if (conceptIsNotYetCached) {
                    ctx.patchState({
                        conceptMap: {
                            ...ctx.getState().conceptMap,
                            [concept.key]: concept
                        }
                    });
                }
                return ctx.dispatch(new LoadFoundationConceptsToStudyRecursively(concept));
            })
        );
    }

    @Action(ConceptUpserted)
    conceptUpserted(ctx: StateContext<ConceptStateModel>, action: ConceptUpserted) {
        return ctx.patchState({
            conceptMap: {
                ...ctx.getState().conceptMap,
                [action.concept.key]: action.concept,
            }
        });
    }

    @Action(ConceptMarkedAsTopLevelConcept)
    conceptMarkedAsTopLevelConcept(ctx: StateContext<ConceptStateModel>, action: ConceptMarkedAsTopLevelConcept) {
        return ctx.patchState({
            topLevelConceptKeys: [
                ...ctx.getState().topLevelConceptKeys,
                action.concept.key
            ]
        });
    }

    @Action(ConceptDeleted)
    conceptDeleted(ctx: StateContext<ConceptStateModel>, action: ConceptDeleted) {
        // deleting the concept itself
        const deletedConcept = action.concept;
        ctx.patchState({
            conceptMap: {
                ...ctx.getState().conceptMap,
                [deletedConcept.key]: undefined
            }
        });
        // updating top level concepts if necessary
        if (ctx.getState().topLevelConceptKeys.includes(deletedConcept.key)) {
            ctx.patchState({
                topLevelConceptKeys: getArrayCopyWithoutValue(ctx.getState().topLevelConceptKeys, deletedConcept.key)
            });
        }
        // removing all references to the deleted concept
        const allConceptsKeys = Object.keys(ctx.getState().conceptMap);
        const allConcepts = allConceptsKeys.map(key => ctx.getState().conceptMap[key]);
        for (const concept of allConcepts) {
            if (!concept || !concept.foundationKeys.includes(deletedConcept.key)) {
                continue;
            }
            const updatedConcept: Concept = {
                ...concept,
                foundationKeys: getArrayCopyWithoutValue(concept.foundationKeys, deletedConcept.key)
            };
            ctx.patchState({
                conceptMap: {
                    ...ctx.getState().conceptMap,
                    [updatedConcept.key]: updatedConcept,
                }
            });
        }
    }
}
