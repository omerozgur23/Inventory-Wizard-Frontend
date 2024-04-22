import { MatDialogModule } from '@angular/material/dialog';
import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './core/component/login/login.component';
import { ErrorComponent } from './core/component/error/error.component';
import { MenuComponent } from './core/component/menu/menu.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, provideHttpClient, withInterceptors } from '@angular/common/http';
import { urlInterceptor } from './core/interceptor/url.interceptor';
import { APP_CONFIG } from './app.config';
import { environment } from './environments/environment';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxPaginationModule } from 'ngx-pagination';
import { AccountComponent } from './core/component/account/account.component';



@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ErrorComponent,
    MenuComponent,
    AccountComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    ToastrModule.forRoot(),
    BrowserAnimationsModule,
    NgxPaginationModule,
    MatDialogModule,
  ],
  providers: [
    provideHttpClient(withInterceptors([urlInterceptor])),
    {
      provide: APP_CONFIG,
      useValue: environment,
    },
    // provideAnimationsAsync(),
    { provide: LOCALE_ID, useValue: 'tr'},
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
