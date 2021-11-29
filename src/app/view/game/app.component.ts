import {Component, OnDestroy, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {ResultModalComponent} from '../../components/result-modal/result-modal.component';
import {EventType, Letter, ModalTypeEnum} from '../../models';
import {GameService} from '../../service/game.service';
import {take} from 'rxjs/operators';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  private result$ = this.gameService.resultBus$;
  private subMenage: Subscription = new Subscription();

  constructor(public dialog: MatDialog, public gameService: GameService) {}

  clickedLetter(event: Letter): void {
    this.gameService.letterClicked(event);
  }

  ngOnInit(): void {
    this.gameService.startGame();

    this.subMenage.add(this.result$.subscribe((type: EventType) => {
      switch (type) {
        case EventType.SUCCESS:
          this.openDialog(ModalTypeEnum.success);
          break;
        case EventType.ERROR:
          this.openDialog(ModalTypeEnum.error);
          break;
        case EventType.GAME_END:
          this.openDialog(ModalTypeEnum.game_end);
          break;
      }
    }));
  }

  ngOnDestroy(): void {
    this.subMenage.unsubscribe();
  }

  private openDialog(type: ModalTypeEnum): void {
    const dialogRef = this.dialog.open(ResultModalComponent, {data: {type}});

    dialogRef.afterClosed().pipe(take(1)).subscribe(() => {
      switch (type) {
        case ModalTypeEnum.success:
          this.gameService.nextRound();
          break;
        case ModalTypeEnum.error:
        case ModalTypeEnum.game_end:
          this.gameService.startGame();
          break;
      }
    });
  }
}
