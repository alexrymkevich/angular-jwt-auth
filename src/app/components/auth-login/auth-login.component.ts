import {Component, OnInit} from '@angular/core';

import {AuthService} from '../../services/auth.service';
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

  private isAuthorized: Boolean = false;

  constructor(
    private authService: AuthService,
  ) {
  }

  ngOnInit() {
  }

  onSubmit(): void {
    const {username, password} = this.userForm.value;
    if (!username.trim() && !password.trim()) {
      return;
    }
    this.authService.login(username, password)
      .subscribe(data => {
        console.log('Login is correct', data);
      });
  }
  refresh(): void {
    this.authService.refreshToken()
      .subscribe(() => {
      });
  }

  logout(): void {
    this.authService.logout()
      .subscribe(data => {
        console.log('logout = ', data);
      });
  }

}
