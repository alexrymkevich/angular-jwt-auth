import {Injectable} from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';

import {tap, map} from 'rxjs/operators';
import {LocalStorageService} from './local-storage.service';
import {StorageKeys} from '../constants/storage-keys';
import {API} from '../constants/API';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private http: HttpClient,
    private localStorage: LocalStorageService,
  ) {
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
          }
        })
      );
  }

  public logout() {
    this.clearAuthData();
    return this.http.post(API.logout, {token: this.getToken()}, {observe: 'response'});
  }

  public getToken(): string | null {
    return this.localStorage.get(StorageKeys.AuthToken) || null;
  }

  public getRefreshToken(): string | null {
    return this.localStorage.get(StorageKeys.RefreshToken) || null;
  }

  public refreshToken() {
    const data = {token: this.getToken(), refreshToken: this.getRefreshToken()};
    return this.http.post(API.refresh, data, {observe: 'response'})
      .pipe(
        tap((response: HttpResponse<any>) => {
          const {token, refreshToken, expiresIn} = response.body;
          if (token) {
            this.localStorage.save(StorageKeys.AuthToken, token);
            this.localStorage.save(StorageKeys.RefreshToken, refreshToken);
            this.localStorage.save(StorageKeys.ExpiredToken, expiresIn);
          }
        })
      );
  }

  public isAuthenticated(): boolean {
    return !!this.getToken();
  }

  private clearAuthData() {
    this.localStorage.delete(StorageKeys.AuthToken);
  }
}
