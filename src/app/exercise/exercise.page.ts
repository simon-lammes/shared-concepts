import {Observable} from 'rxjs';
import {Component, OnInit} from '@angular/core';
import {Select} from '@ngxs/store';
import {ConceptState} from '../concepts/concept.state';
import {Concept} from '../concepts/concept.model';
import {first, map, switchMap} from 'rxjs/operators';
import {ActivatedRoute, Router} from '@angular/router';
import {ExerciseService} from './exercise.service';
import {AlertController} from '@ionic/angular';

@Component({
    selector: 'app-exercise',
    templateUrl: './exercise.page.html',
    styleUrls: ['./exercise.page.scss'],
})
export class ExercisePage implements OnInit {
    @Select(ConceptState.mainConceptToStudy) mainConceptToStudy$: Observable<Concept>;
    conceptKey$: Observable<string>;
    concept$: Observable<Concept>;
    answeredCorrectly: boolean = undefined;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private exerciseService: ExerciseService,
        private alertController: AlertController
    ) {
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
            })
        );
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
            message: 'You have seen all exercises for your chosen topic recently.',
            buttons: [
                {
                    text: 'shorten cooldown time',
                    handler: () => {
                        this.router.navigate(['settings']);
                    },
                },
                {
                    text: 'choose broader topic / concept',
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
}

