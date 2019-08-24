import {Observable, of} from 'rxjs';
import {Component, OnInit} from '@angular/core';
import {Select} from '@ngxs/store';
import {ConceptState} from '../concepts/concept.state';
import {Concept} from '../concepts/concept.model';
import {first, map, switchMap, tap, withLatestFrom} from 'rxjs/operators';
import {ActivatedRoute, Router} from '@angular/router';
import {ExerciseService} from './exercise.service';
import {AlertController, PopoverController} from '@ionic/angular';
import {ExerciseTypes} from './exercise.model';
import {SharedConceptSettings} from '../settings/settings.model';
import {SettingsService} from '../settings/settings.service';
import {MoreRequestedComponent, MoreRequestedData} from './more-requested/more-requested.component';

@Component({
    selector: 'app-exercise',
    templateUrl: './exercise.page.html',
    styleUrls: ['./exercise.page.scss'],
})
export class ExercisePage implements OnInit {
    @Select(ConceptState.mainConceptToStudy) mainConceptToStudy$: Observable<Concept>;
    conceptKey$: Observable<string>;
    concept$: Observable<Concept>;
    settings$: Observable<SharedConceptSettings>;
    answeredCorrectly: boolean = undefined;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private exerciseService: ExerciseService,
        private alertController: AlertController,
        private settingsService: SettingsService,
        private popoverController: PopoverController
    ) {
    }

    get isCurrentExerciseTypeUnknown$() {
        return this.concept$.pipe(
            map(concept => {
                return concept.exercise && !ExerciseTypes.ALL_TYPES.includes(concept.exercise.type);
            })
        );
    }

    ngOnInit(): void {
        this.conceptKey$ = this.route.paramMap.pipe(
            first(),
            map(paramMap => {
                return paramMap.get('conceptKey');
            })
        );
        this.conceptKey$.subscribe(() => this.answeredCorrectly = undefined);
        this.concept$ = this.conceptKey$.pipe(
            first(),
            switchMap(conceptKey => {
                return this.exerciseService.getConceptByKey$(conceptKey);
            }),
            tap(concept => {
                if (!concept) {
                    this.router.navigateByUrl(`exercise`);
                }
            })
        );
        this.settings$ = this.settingsService.fetchSettingsForCurrentUser$();
    }

    onAnswered(answeredCorrectly: boolean) {
        this.answeredCorrectly = answeredCorrectly;
        this.conceptKey$.pipe(
            first(),
            switchMap(conceptKey => {
                return this.exerciseService.saveUserAnswerResult(conceptKey, answeredCorrectly);
            })
        ).subscribe();
    }

    navigateToNextExercise() {
        this.exerciseService.getNextConceptKeyToStudy$().subscribe(conceptKey => {
            if (!conceptKey) {
                this.informUserThatCurrentlyNoExerciseIsAvailable();
                return;
            }
            this.answeredCorrectly = undefined;
            this.router.navigateByUrl(`exercise/${conceptKey}`);
        });
    }

    informUserThatCurrentlyNoExerciseIsAvailable() {
        this.alertController.create({
            header: 'Exercise finished',
            message: 'You have seen all enabled exercises for your chosen topic recently. ' +
                'In order to study on you can either choose a broader topic or change the settings. ' +
                'Maybe the cooldown time is too long or you have some exercise types disabled.',
            buttons: [
                {
                    text: 'settings',
                    handler: () => {
                        this.router.navigate(['settings']);
                    },
                },
                {
                    text: 'choose new concept',
                    handler: () => {
                        this.router.navigate(['concepts']);
                    }
                },
                {
                    text: 'finish exercising',
                    role: 'cancel'
                }
            ]
        }).then(alertElement => alertElement.present());
    }

    async onMoreRequested(event: any) {
        const popover = await this.popoverController.create({
            component: MoreRequestedComponent,
            event,
            translucent: true
        });
        popover.onWillDismiss().then(input => {
            const data: MoreRequestedData = input.data;
            switch (data.chosenOption) {
                case 'DISABLE_EXERCISE':
                    this.disableCurrentExercise();
                    break;
                case 'DISABLE_EXERCISE_TYPE':
                    this.disableCurrentExerciseType();
                    break;
            }
        });
        return await popover.present();
    }

    private disableCurrentExercise() {
        this.settings$.pipe(
            first(),
            withLatestFrom(this.concept$),
            switchMap(([settings, concept]) => {
                if (!settings.conceptKeysOfDisabledExercises) {
                    settings.conceptKeysOfDisabledExercises = [];
                }
                if (settings.conceptKeysOfDisabledExercises.includes(concept.key)) {
                    return of(undefined);
                }
                settings.conceptKeysOfDisabledExercises.push(concept.key);
                return this.settingsService.saveSettings(settings);
            })
        ).subscribe();
        this.navigateToNextExercise();
    }

    private disableCurrentExerciseType() {
        this.settings$.pipe(
            first(),
            withLatestFrom(this.concept$),
            switchMap(([settings, concept]) => {
                if (!settings.disabledExerciseTypes) {
                    settings.disabledExerciseTypes = [];
                }
                if (!concept.exercise || settings.disabledExerciseTypes.includes(concept.exercise.type)) {
                    return of(undefined);
                }
                settings.disabledExerciseTypes.push(concept.exercise.type);
                return this.settingsService.saveSettings(settings);
            })
        ).subscribe();
        this.navigateToNextExercise();
    }
}

