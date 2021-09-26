import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LetterButtonComponent } from './letter-button/letter-button.component';
import {MatButtonModule} from '@angular/material/button';
import { ResultModalComponent } from './result-modal/result-modal.component';
import {MatDialogModule} from '@angular/material/dialog';

@NgModule({
  declarations: [LetterButtonComponent, ResultModalComponent],
  exports: [
    LetterButtonComponent,
    ResultModalComponent
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    MatDialogModule,
  ],
  entryComponents: [ResultModalComponent]
})
export class ComponentsModule { }
