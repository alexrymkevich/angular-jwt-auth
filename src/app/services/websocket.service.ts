import {Injectable} from '@angular/core';
import * as io from 'socket.io-client';
import {Observable, Subject} from 'rxjs';
import {WEBSCOKET_URL} from '../constants/API';
import {AuthService} from './auth.service';

@Injectable({
  providedIn: 'root'
})

export class WebsocketService {

  // Our socket connection
  private socket;

  constructor(
    private authService: AuthService,
  ) {
  }

  connect(): Subject<MessageEvent> {
    // If you aren't familiar with environment variables then
    // you can hard code `environment.ws_url` as `http://localhost:5000`
    this.socket = io(WEBSCOKET_URL, { query: `auth_token=${this.authService.getToken()}` });

    // We define our observable which will observe any incoming messages
    // from our socket.io server.
    const observable = new Observable(observer => {
      this.socket.on('data', (data) => {
        observer.next(data);
      });
      this.socket.on('info', (data) => {
        observer.next(data);
      });
      return () => {
        this.socket.disconnect();
      };
    });

    // We define our Observer which will listen to messages
    // from our other components and send messages back to our
    // socket server whenever the `next()` method is called.
    const observer = {
      next: (data: Object) => {
        this.socket.emit('command', JSON.stringify(data));
      },
    };

    // we return our Rx.Subject which is a combination
    // of both an observer and observable.
    return Subject.create(observer, observable);
  }

}
