import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';
import {EventType, Letter, Word} from '../models';
import {POSSIBILITY_MISTAKES} from '../data/constrain';
import {WebsocketClientService} from './websocket-client.service';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  #isAdmin = false;

  wordOriginal: Word | undefined;
  alphabet: Letter[] = [...'ABCDEFGHIJKLMNOPQRSTUWYZ'.split('')];
  displayWordAnswer: Word = '';
  mistakes = 0;
  resultBus$: Subject<EventType> = new Subject();

  constructor(private websocketClient: WebsocketClientService) { }

  startGame(word: string): void {
    this.wordOriginal = word;

    this.setupRound();
  }

  private setupRound(): void {
    if (!this.wordOriginal) {
      return; // TODO: error
    }

    this.displayWordAnswer = this.wordOriginal.split('').map(() => '*').join('');
  }

  set isAdmin(b: boolean) {
    this.#isAdmin = b;
  }

  get isAdmin(): boolean {
    return this.#isAdmin;
  }

  letterClicked(letter: Letter): void {
    const letterCheck = this.checkWord(letter);

    letterCheck ? this.websocketClient.sendLetter(letter) : this.websocketClient.sendMistake(letter);

    if (!this.displayWordAnswer.includes('*')) {
      // TODO: o końcu gry
      this.resultBus$.next(EventType.SUCCESS);
    }
  }

  letterFromWS(letter: string): void {
    this.checkWord(letter);
  }

  updateMistake(): void {
    if (this.mistakes++ === POSSIBILITY_MISTAKES - 1) {
      this.resultBus$.next(EventType.ERROR);
    }
  }

  resetMistakes(): void {
    this.mistakes = 0;
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
