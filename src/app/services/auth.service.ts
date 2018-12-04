import {Injectable} from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';

import {tap, map} from 'rxjs/operators';
import {LocalStorageService} from './local-storage.service';
import {StorageKeys} from '../constants/storage-keys';
import {API} from '../constants/API';
import {WebsocketService} from './websocket.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public isAuthorized: Boolean = false;
  public isRefreshInProgress: Boolean = false;

  constructor(
    private http: HttpClient,
    private localStorage: LocalStorageService,
    private websocket: WebsocketService
  ) {

    const token = this.localStorage.get(StorageKeys.AuthToken);

    if (token) {
      const isExpired = (+new Date() - +(new Date(this.localStorage.get(StorageKeys.ExpiredToken))) > 0);
      if (isExpired) {
        this.refreshToken().subscribe(() => {
          this.isAuthorized = true;
        });
      } else {
        this.isAuthorized = true;
        this.websocket.connect();
      }
    } else {
      this.isAuthorized = false;
    }
  }

  public login(username: string, password: string) {
    const payload = {
      username: username,
      password: password
    };

    return this.http.post(API.login, payload, {observe: 'response'})
      .pipe(
        tap((response: HttpResponse<any>) => {
          const {token, refreshToken, expiresIn} = response.body;
          if (token) {
            this.localStorage.save(StorageKeys.AuthToken, token);
            this.localStorage.save(StorageKeys.RefreshToken, refreshToken);
            this.localStorage.save(StorageKeys.ExpiredToken, expiresIn);
            this.isAuthorized = true;
            this.websocket.connect();
          }
        })
      );
  }

  public logout() {
    return this.http.post(API.logout, {token: this.getToken()}, {observe: 'response'}).pipe(
      tap((response: HttpResponse<any>) => {
        this.isAuthorized = false;
        this.clearAuthData();
        this.websocket.close();
      })
    );
  }

  public getToken(): string | null {
    return this.localStorage.get(StorageKeys.AuthToken) || null;
  }

  public getRefreshToken(): string | null {
    return this.localStorage.get(StorageKeys.RefreshToken) || null;
  }

  public refreshToken() {
    const data = {token: this.getToken(), refreshToken: this.getRefreshToken()};
    this.isRefreshInProgress = true;
    return this.http.post(API.refresh, data, {observe: 'response'})
      .pipe(
        tap((response: HttpResponse<any>) => {
          this.isRefreshInProgress = false;
          const {token, refreshToken, expiresIn} = response.body;
          if (token) {
            this.localStorage.save(StorageKeys.AuthToken, token);
            this.localStorage.save(StorageKeys.RefreshToken, refreshToken);
            this.localStorage.save(StorageKeys.ExpiredToken, expiresIn);
            this.isAuthorized = true;
            this.websocket.refreshConnection();
          } else {
            this.clearAuthData();
          }
        })
      );
  }

  private clearAuthData() {
    this.isAuthorized = false;
    this.localStorage.delete(StorageKeys.AuthToken);
    this.localStorage.delete(StorageKeys.RefreshToken);
    this.localStorage.delete(StorageKeys.ExpiredToken);
  }
}
