import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {environment} from '../../environments/environment';
import {Alphabet, AlphabetResponse, WordArray, WordResponse} from '../models';
import {MAX_POSSIBILITY_WINS} from '../data/constrain';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(private httpClient: HttpClient){ }

  getAlphabet(): Observable<Alphabet> {
    return this.httpClient.get<AlphabetResponse>(environment.letters).pipe(map(response => response[0]));
  }

  getWord(): Observable<WordArray> {
    return this.httpClient.get<WordResponse>(environment.answers)
      .pipe(map(response => {
        const resultArray: WordArray = [];

        while (resultArray.length < MAX_POSSIBILITY_WINS) {
          resultArray.push(response[Math.floor(Math.random() * response.length)]);
        }

        return resultArray;
      }));
  }
}
