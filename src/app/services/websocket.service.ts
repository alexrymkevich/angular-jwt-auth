import {Injectable} from '@angular/core';
import * as io from 'socket.io-client';
import {Observable, Subject} from 'rxjs';
import {WEBSOCKET_URL} from '../constants/API';
import {LocalStorageService} from './local-storage.service';
import {StorageKeys} from '../constants/storage-keys';

@Injectable({
  providedIn: 'root'
})

export class WebsocketService {

  private socket: any = null;
  public socket$: Subject<any> = new Subject<any>();

  constructor(
    private localStorage: LocalStorageService,
  ) {
  }

  public emit(chanel, message) {
    return new Observable<any>(observer => {
      if (this.socket) {
        console.log(`emit to ${chanel}:`, message);
        this.socket.emit(chanel, message, function (data) {
          if (data.success) {
            observer.next(data.msg);
          } else {
            observer.error(data.msg);
          }
          observer.complete();
        });
      }
    });
  }

  public on(event_name) {
    return new Observable<any>(observer => {
      console.log(`listen to ${event_name}:`);
      // this.socket.off(event_name);
      this.socket.on(event_name, (data) => {
        observer.next(data);
      });
    });
  }

  public connect() {
    if (!this.socket) {
      const token = this.localStorage.get(StorageKeys.AuthToken) || null;
      if (token) {
        this.socket = io(WEBSOCKET_URL, {query: `auth_token=${token}`});
        this.socket.on('connect', () => this.connected());
        this.socket.on('disconnect', () => this.disconnected());
        this.socket.on('error', (error: string) => {
          console.log(`ERROR: "${error}" (${WEBSOCKET_URL})`);
        });
      }
    } else {
      this.socket.connect();
    }
  }

  public close() {
    this.socket.disconnect();
    this.socket = null;
  }

  public refreshConnection() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
    this.connect();
  }

  private connected() {
    this.socket$.next(true);
    console.log('Connected');
  }

  private disconnected() {
    console.log('Disconnected');
  }
}
