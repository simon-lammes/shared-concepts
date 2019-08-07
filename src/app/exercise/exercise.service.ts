import {Exercise} from './exercise.model';
import {Observable} from 'rxjs';
import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class ExerciseService {

    constructor(private http: HttpClient) {
    }

    loadConceptByKey(conceptKey: string): Observable<Exercise> {
        return this.http.get<Exercise>(environment.exerciseURL + `/Exercises/${conceptKey}.json`);
    }
}
