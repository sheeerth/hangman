import { Component } from '@angular/core';
import {WebsocketClientService} from '../../../service/websocket-client.service';

@Component({
  selector: 'app-main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.scss']
})
export class MainMenuComponent {
  gameID = '';
  error = '';

  constructor(private websocketClient: WebsocketClientService) { }

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
