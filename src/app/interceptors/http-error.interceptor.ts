import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest, HttpEvent } from '@angular/common/http';

import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import {LocalStorageService} from '../services/local-storage.service';
import {HttpStatusCodes} from '../constants/http-status-codes';
import {StorageKeys} from '../constants/storage-keys';

@Injectable()

export class HttpErrorInterceptor implements HttpInterceptor {

  constructor(
    private localStorage: LocalStorageService,
  ) {

  }

    public intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request)
            .pipe(
                catchError((error) => {
                  if (error && error.error && error.error.message) {
                    alert(error.error.message);
                  }
                  if (error.status === HttpStatusCodes.Unauthorized || error.status === HttpStatusCodes.Forbidden) {
                    this.localStorage.delete(StorageKeys.AuthToken);
                    this.localStorage.delete(StorageKeys.RefreshToken);
                    this.localStorage.delete(StorageKeys.ExpiredToken);
                  }

                  throw error;
                })
            );
    }
}
