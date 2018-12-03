import {Component, OnInit} from '@angular/core';

import {User} from './User';
import {AuthService} from '../../services/auth.service';
import {LocalStorageService} from '../../services/local-storage.service';
import {StorageKeys} from '../../constants/storage-keys';
import {FormGroup, FormControl} from '@angular/forms';

@Component({
  selector: 'app-auth-login',
  templateUrl: './auth-login.component.html',
  styleUrls: ['./auth-login.component.css']
})
export class AuthLoginComponent implements OnInit {
  userForm = new FormGroup({
    username: new FormControl('alex'),
    password: new FormControl('alexpass'),
  });

  private isNeedAuth: Boolean = true;
  private isExpired: Boolean;

  constructor(
    private authService: AuthService,
    private localStorage: LocalStorageService,
  ) {
  }

  ngOnInit() {
    this.isNeedAuth = !!this.localStorage.get(StorageKeys.AuthToken);
    this.isExpired = (+new Date() - +(new Date(this.localStorage.get(StorageKeys.ExpiredToken))) > 0)
      && !this.localStorage.get(StorageKeys.RefreshToken);
  }

  onSubmit(): void {
    const {username, password} = this.userForm.value;
    if (!username.trim() && !password.trim()) {
      return;
    }
    this.authService.login(username, password)
      .subscribe(data => {
        console.log(data, 'Login is correct');
        this.isNeedAuth = !!this.localStorage.get(StorageKeys.AuthToken);
      });
  }
  onRefresh(): void {
    this.authService.refreshToken()
      .subscribe(data => {
        this.isNeedAuth = !!this.localStorage.get(StorageKeys.AuthToken);
      });
  }

}
