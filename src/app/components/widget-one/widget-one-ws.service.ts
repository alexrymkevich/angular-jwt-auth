import {Injectable} from '@angular/core';
import {WebsocketService} from '../../services/websocket.service';
import {Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WidgetOneWsService {

  data: Subject<any>;

  constructor(private wsService: WebsocketService) {
    this.data = <Subject<any>>wsService
      .connect();
  }
}
