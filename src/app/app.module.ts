import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';

import { AppComponent } from './app.component';
import { AuthLoginComponent } from './components/auth-login/auth-login.component';
import {HttpErrorInterceptor} from './interceptors/http-error.interceptor';
import { WidgetOneComponent } from './components/widget-one/widget-one.component';

@NgModule({
  declarations: [
    AppComponent,
    AuthLoginComponent,
    WidgetOneComponent,
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: HttpErrorInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
