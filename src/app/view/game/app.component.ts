import {Component, OnDestroy, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {ResultModalComponent} from '../../components/result-modal/result-modal.component';
import {Letter, ModalTypeEnum} from '../../models';
import {GameService} from '../../service/game.service';
import {take, tap} from 'rxjs/operators';
import {Subscription} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import {SocketEventsListener, WebsocketClientService} from '../../service/websocket-client.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  private result$ = this.gameService.resultBus$;
  private subMenage: Subscription = new Subscription();
  private socketEvents = this.websocketClient.socketEvents.pipe(tap(message => {
    switch (message.event) {
      case SocketEventsListener.LETTER:
        console.log('letter', message.data);
        break;
      case SocketEventsListener.WORD:
        this.gameService.startGame(message.data);
        console.log('word', message.data);
        break;
      case SocketEventsListener.MISTAKE:
        console.log('mistake', message.data);
        break;
    }
  }));

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog,
    public gameService: GameService,
    private websocketClient: WebsocketClientService
  ) {}

  clickedLetter(event: Letter): void {
    this.gameService.letterClicked(event);
  }

  ngOnInit(): void {
    if (!this.route.snapshot.queryParams.game_id) {
      this.router.navigate(['']);
      return;
    }

    this.subMenage.add(this.socketEvents.subscribe());
    //
    // this.subMenage.add(this.result$.subscribe((type: EventType) => {
    //   switch (type) {
    //     case EventType.SUCCESS:
    //       this.openDialog(ModalTypeEnum.success);
    //       break;
    //     case EventType.ERROR:
    //       this.openDialog(ModalTypeEnum.error);
    //       break;
    //     case EventType.GAME_END:
    //       this.openDialog(ModalTypeEnum.game_end);
    //       break;
    //   }
    // }));
  }

  ngOnDestroy(): void {
    this.subMenage.unsubscribe();
  }

  // private openDialog(type: ModalTypeEnum): void {
  //   const dialogRef = this.dialog.open(ResultModalComponent, {data: {type}});
  //
  //   dialogRef.afterClosed().pipe(take(1)).subscribe(() => {
  //     switch (type) {
  //       case ModalTypeEnum.success:
  //         this.gameService.nextRound();
  //         break;
  //       case ModalTypeEnum.error:
  //       case ModalTypeEnum.game_end:
  //         this.gameService.startGame();
  //         break;
  //     }
  //   });
  // }
  startGame(): void {
    this.websocketClient.setWord();
  }
}
