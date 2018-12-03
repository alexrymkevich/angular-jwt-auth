import {Component, OnInit} from '@angular/core';
import {WidgetOneWsService} from './widget-one-ws.service';

@Component({
  selector: 'app-widget-one',
  templateUrl: './widget-one.component.html',
  styleUrls: ['./widget-one.component.css']
})
export class WidgetOneComponent implements OnInit {

  constructor(private widgetOneWsService: WidgetOneWsService) {
  }

  ngOnInit() {
    this.widgetOneWsService.data.subscribe(data => {
      console.log(data);
    });
  }

}
