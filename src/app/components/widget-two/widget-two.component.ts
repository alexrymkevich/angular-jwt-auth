import {Component, OnInit} from '@angular/core';
import {WebsocketService} from '../../services/websocket.service';
import {AutoUnsubscribe} from '../../utils/auto-unsubscribe.class';

@Component({
  selector: 'app-widget-two',
  templateUrl: './widget-two.component.html',
  styleUrls: ['./widget-two.component.css']
})
export class WidgetTwoComponent extends AutoUnsubscribe implements OnInit {

  private widgetType = 'widgetTwo';
  private channels = ['info'];

  constructor(private wsService: WebsocketService) {
    super();
    const ws = this.wsService.socket$.subscribe(() => {
      this.channels.forEach(item => {
        this.wsService.on(item).subscribe(data => {
          console.log(this.widgetType, ':', data);
        });
      });
    });
    this.subscriptions.push(ws);
  }

  ngOnInit() {
  }

}
