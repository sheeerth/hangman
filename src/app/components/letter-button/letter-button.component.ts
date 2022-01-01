import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-letter-button',
  template: '<button (click)="buttonClickedEvent()"  mat-stroked-button class="inline-flex items-center justify-center px-5 py-3 border border-transparent text-3xl font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50"><span>{{letter}}</span></button>',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LetterButtonComponent {
  @Input() letter: string | undefined;
  @Output() buttonClicked = new EventEmitter<string>();

  buttonClickedEvent(): void {
    this.buttonClicked.emit(this.letter);
  }
}
