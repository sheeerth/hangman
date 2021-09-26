import {ChangeDetectionStrategy, Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {ModalData} from '../../models';

@Component({
  selector: 'app-result-modal',
  templateUrl: './result-modal.component.html',
  styleUrls: ['./result-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ResultModalComponent {

  constructor(public dialogRef: MatDialogRef<ResultModalComponent>, @Inject(MAT_DIALOG_DATA) public data: ModalData) { }

  closeModal(): void {
    this.dialogRef.close();
  }
}
