import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';
import {EventType, Letter, Word} from '../models';
import {POSSIBILITY_MISTAKES} from '../data/constrain';
import {WebsocketClientService} from './websocket-client.service';

@Injectable({
  providedIn: 'root'
})
export class GameService {
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

  letterClicked(letter: Letter): void {
    if (!this.checkWord(letter) && this.mistakes++ === POSSIBILITY_MISTAKES - 1) {
      // TODO: info o bledzie
      this.resultBus$.next(EventType.ERROR);
    }

    if (!this.displayWordAnswer.includes('*')) {
      // TODO: o końcu gry
      this.resultBus$.next(EventType.SUCCESS);
    }
  }

  private checkWord(event: Letter): boolean {
    if (event === '' || !this.wordOriginal || this.displayWordAnswer.includes(event.toLowerCase())) {
      this.websocketClient.sendMistake();

      return false;
    }

    const positionArray: number[] = [];

    this.wordOriginal.split('').forEach((char, index) => {
      if (char === event.toLowerCase()) {
        positionArray.push(index);
      }
    });

    if (positionArray.length === 0) {
      this.websocketClient.sendMistake();

      return false;
    }

    this.displayWordAnswer = positionArray.reduce((word, index) => {
      const stringArray = word.split('');
      stringArray[index] = (this.wordOriginal as string)[index];

      return stringArray.join('');
    }, this.displayWordAnswer);

    this.websocketClient.sendLetter(event);

    return true;
  }
}
