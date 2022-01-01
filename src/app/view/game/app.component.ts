import {Component, OnDestroy, OnInit} from '@angular/core';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {ResultModalComponent} from '../../components/result-modal/result-modal.component';
import {EventType, Letter, ModalTypeEnum} from '../../models';
import {GameService} from '../../service/game.service';
import {filter, map, take, tap} from 'rxjs/operators';
import {Subscription} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import {SocketEventsListener, WebsocketClientService} from '../../service/websocket-client.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  gameID = '';
  private result$ = this.gameService.resultBus$;
  private subMenage: Subscription = new Subscription();
  private socketEvents = this.websocketClient.socketEvents.pipe(tap(message => {
    switch (message.event) {
      case SocketEventsListener.LETTER:
        this.gameService.letterFromWS(message.data);
        break;
      case SocketEventsListener.WORD:
        if (this.dialogRef) {
          this.dialogRef.close();
        }

        this.gameService.startGame(message.data);
        break;
      case SocketEventsListener.MISTAKE:
        this.gameService.updateMistake();
        break;
      case SocketEventsListener.WIN:
        this.openDialog(ModalTypeEnum.success);
        break;
    }
  }));
  private userInGameArray: any[] = [];
  userInGame$ = this.websocketClient.socketEvents.pipe(
    filter(message => message.event === SocketEventsListener.USER_JOINED || message.event === SocketEventsListener.USERS),
    map(message => {
      if (message.event === SocketEventsListener.USERS) {
        this.userInGameArray = message.data;
      } else {
        this.userInGameArray = [...this.userInGameArray, message.data];
      }

      return this.userInGameArray;
    })
  );

  isAdmin: boolean = this.gameService.isAdmin;
  private dialogRef?: MatDialogRef<ResultModalComponent, any>;

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

    this.gameID = this.route.snapshot.queryParams.game_id;

    this.websocketClient.joinToRoom(this.gameID);
    this.subMenage.add(this.socketEvents.subscribe());

    this.subMenage.add(this.result$.subscribe((type: EventType) => {
      switch (type) {
        case EventType.SUCCESS:
          this.websocketClient.winGame();
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
    this.dialogRef = this.dialog.open(ResultModalComponent, {data: {type, isAdmin: this.isAdmin}});

    this.dialogRef.afterClosed().pipe(take(1)).subscribe(() => {
      this.startGame();
    });
  }

  startGame(): void {
    this.websocketClient.setWord();
    this.gameService.resetMistakes();
  }
}
