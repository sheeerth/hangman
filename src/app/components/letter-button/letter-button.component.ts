import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-letter-button',
  template: '<button (click)="buttonClickedEvent()"  mat-stroked-button class="btn-letter"><span class="btn-text">{{letter}}</span></button>',
  styleUrls: ['./letter-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LetterButtonComponent {
  @Input() letter: string | undefined;
  @Output() buttonClicked = new EventEmitter<string>();

  buttonClickedEvent(): void {
    this.buttonClicked.emit(this.letter);
  }
}
