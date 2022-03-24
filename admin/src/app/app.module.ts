import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NZ_I18N } from 'ng-zorro-antd/i18n';
import { de_DE } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import de from '@angular/common/locales/de';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgZorroAntdModule } from './ng-zorro-antd.module';
import { HeaderComponent } from './components/header/header.component';
import { NavigationComponent } from './components/navigation/navigation.component';
import { LoginComponent } from './features/login/login.component';
import { MainLayoutComponent } from './components/main-layout/main-layout.component';
import { UserAdministrationComponent } from './features/user-administration/user-administration.component';
import { UserLoggedInGuard } from './auth/logged-in.guard';
import { UserNotLoggedInGuard } from './auth/not-logged-in.guard';
import { environment } from 'src/environments/environment';
import { JwtModule } from '@auth0/angular-jwt';
import { EditComponent } from './features/user-administration/edit/edit.component';
import { IdiomNavigationComponent } from './components/navigation/idiom-navigation/idiom-navigation.component';
import { UsersNavigationComponent } from './components/navigation/users-navigation/users-navigation.component';
import { DbAdministrationComponent } from './features/admin/db-administration/db-administration.component';
import { EditorComponent } from './features/editor/editor.component';
import { AdminComponent } from './features/admin/admin.component';
import { IndexAdministrationComponent } from './features/admin/index-administration/index-administration.component';

registerLocaleData(de);

const TOKEN_KEY = 'jwt';
export function tokenGetter() {
  return localStorage.getItem(TOKEN_KEY);
}
@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    NavigationComponent,
    LoginComponent,
    MainLayoutComponent,
    UserAdministrationComponent,
    EditComponent,
    IdiomNavigationComponent,
    UsersNavigationComponent,
    DbAdministrationComponent,
    EditorComponent,
    AdminComponent,
    IndexAdministrationComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    NgZorroAntdModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        allowedDomains: [environment.apiHost],
        disallowedRoutes: [environment.apiUrl + '/users/token']
      }
    }),
    ReactiveFormsModule,
  ],
  providers: [
    UserLoggedInGuard,
    UserNotLoggedInGuard,
    { provide: NZ_I18N, useValue: de_DE }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
