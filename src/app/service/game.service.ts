import {Injectable} from '@angular/core';
import {ApiService} from './api.service';
import {Observable, Subject} from 'rxjs';
import {map} from 'rxjs/operators';
import {EventType, Letter, Word, WordArray} from '../models';
import {MAX_POSSIBILITY_WINS, POSSIBILITY_MISTAKES} from '../data/constrain';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private wordOriginal: Word | undefined;
  private roundCounter = 0;
  private wordsArray: WordArray | undefined;

  displayWordAnswer: Word = '';
  mistakes = 0;
  alphabet$: Observable<Letter[]> = this.apiService.getAlphabet().pipe(map(value => value.split('')));
  resultBus$: Subject<EventType> = new Subject();

  constructor(private apiService: ApiService) { }

  startGame(): void {
    this.apiService.getWord().subscribe((data) => {
      this.wordsArray = data;

      this.setupRoundAndGame(true);
    });
  }

  nextRound(): void {
    this.setupRoundAndGame(false);
  }

  private setupRoundAndGame(newGame: boolean): void {
    this.roundCounter = newGame ? 0 : this.roundCounter++;

    if (this.roundCounter === MAX_POSSIBILITY_WINS) {
      this.resultBus$.next(EventType.GAME_END);

      return;
    }

    this.mistakes = 0;

    if (!this.wordsArray) {
      return;
    }

    this.wordOriginal = this.wordsArray[this.roundCounter];
    this.displayWordAnswer = this.wordOriginal.split('').map(() => '*').join('');
  }

  letterClicked(letter: Letter): void {
    if (!this.checkWord(letter) && this.mistakes++ === POSSIBILITY_MISTAKES - 1) {
      this.resultBus$.next(EventType.ERROR);
    }

    if (!this.displayWordAnswer.includes('*')) {
      this.resultBus$.next(EventType.SUCCESS);
    }
  }

  private checkWord(event: Letter): boolean {
    if (event === '' || !this.wordOriginal || this.displayWordAnswer.includes(event.toLowerCase())) {
      return false;
    }

    const positionArray: number[] = [];

    this.wordOriginal.split('').forEach((char, index) => {
      if (char === event.toLowerCase()) {
        positionArray.push(index);
      }
    });

    if (positionArray.length === 0) {
      return false;
    }

    this.displayWordAnswer = positionArray.reduce((word, index) => {
      const stringArray = word.split('');
      stringArray[index] = (this.wordOriginal as string)[index];

      return stringArray.join('');
    }, this.displayWordAnswer);

    return true;
  }
}
