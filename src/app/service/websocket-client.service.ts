import { Injectable } from '@angular/core';
import {io, Socket} from 'socket.io-client';
import {Subject} from 'rxjs';
import {environment} from '../../environments/environment';

export enum SocketEventsListener {
  CONNECT = 'connect',
  DISCONNECT = 'disconnect',
  ROOM_CREATED = 'room_created',
  ROOM_JOINED = 'room_joined',
  WORD = 'word',
  LETTER = 'letter',
  MISTAKE = 'mistake',
  USER_JOINED = 'user_join',
  USERS = 'users',
  WIN = 'win',
}

export enum SocketEventsEmitter {
  CREATE_ROOM = 'create_room',
  JOIN_TO_ROOM = 'join',
  GET_WORD = 'get_word',
  SET_LETTER = 'set_letter',
  SET_MISTAKE = 'set_mistake',
  WIN_GAME = 'win_game',
}

@Injectable({
  providedIn: 'root'
})
export class WebsocketClientService {
  socketEvents: Subject<{event: SocketEventsListener, data: any}> = new Subject();
  connectedWithRoom = false;

  private socket: Socket = io(environment.webSocketUrl);

  constructor() {
    Object.values(SocketEventsListener).forEach(event =>
      this.socket.on(event, (data) =>
        this.socketEvents.next({event, data})
      )
    );
  }

  joinToRoom(ID: string): void {
    if (!this.connectedWithRoom) {
      this.socket.emit(SocketEventsEmitter.JOIN_TO_ROOM, ID);
    }

    this.connectedWithRoom = true;
  }

  createRoom(): void {
    this.socket.emit(SocketEventsEmitter.CREATE_ROOM);
  }

  setWord(): void {
    this.socket.emit(SocketEventsEmitter.GET_WORD);
  }

  sendLetter(letter: string): void {
    this.socket.emit(SocketEventsEmitter.SET_LETTER, letter);
  }

  sendMistake(): void {
    this.socket.emit(SocketEventsEmitter.SET_MISTAKE);
  }

  winGame(): void {
    this.socket.emit(SocketEventsEmitter.WIN_GAME);
  }
}
