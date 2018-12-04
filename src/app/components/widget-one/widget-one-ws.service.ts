import {Injectable, OnDestroy} from '@angular/core';
import {WebsocketService} from '../../services/websocket.service';
import {AutoUnsubscribe} from '../../utils/auto-unsubscribe.class';

@Injectable({
  providedIn: 'root'
})
export class WidgetOneWsService extends AutoUnsubscribe implements OnDestroy {
  private widgetType = 'widgetOne';
  private channels = ['info', 'data'];

  constructor(private wsService: WebsocketService) {
    super();
    const ws = this.wsService.socket$.subscribe(() => {
      this.channels.forEach(item => {
        this.wsService.on(item).subscribe(data => {
          console.log(this.widgetType, ':', data);
        });
      });

      setTimeout(() => {
        this.emit('command', {widget: this.widgetType, type: 'ADD_CHANNEL', data: 'channel2'});
      }, 5000);
      setTimeout(() => {
        this.emit('command', {widget: this.widgetType, type: 'REMOVE_CHANNEL', data: 'channel1'});
      }, 10000);
    });
    this.subscriptions.push(ws);
  }

  public emit(channel, data) {
    this.wsService.emit(channel, data).subscribe(msg => {
      console.log(this.widgetType, ':', msg);
    });
  }
}
