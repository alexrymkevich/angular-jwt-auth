import { TestBed } from '@angular/core/testing';

import { WidgetOneWsService } from './widget-one-ws.service';

describe('WidgetOneWsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: WidgetOneWsService = TestBed.get(WidgetOneWsService);
    expect(service).toBeTruthy();
  });
});
