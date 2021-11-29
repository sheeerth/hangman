import { Component } from '@angular/core';
import {SocketEventsListener, WebsocketClientService} from '../../../service/websocket-client.service';
import {filter, switchMap, take} from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.scss']
})
export class MainMenuComponent {
  gameID = '';
  error = '';

  private socketListener = this.websocketClient.socketEvents;

  constructor(private websocketClient: WebsocketClientService, private router: Router) {
    this.socketListener.pipe(
      filter(message => message.event === SocketEventsListener.ROOM_CREATED),
      take(1),
    ).subscribe(message => this.websocketClient.joinToRoom(message.data));

    this.socketListener.pipe(
      filter(message => message.event === SocketEventsListener.ROOM_JOINED),
      take(1)).subscribe(message => this.router.navigate(['/game'], {queryParams: {game_id: message.data}}));
  }

  joinToRoom(): void {
    if (!this.gameID) {
      this.error = 'Please enter game ID';

      return;
    }

    this.websocketClient.joinToRoom(this.gameID);

    this.error = '';
    this.gameID = '';
  }

  createRoom(): void {
    this.websocketClient.createRoom();
  }
}
