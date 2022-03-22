import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { LanguageSelectionComponent } from './components/language-selection/language-selection.component';
import { MainComponent } from './components/main/main.component';
import { FooterComponent } from './components/footer/footer.component';
import { SearchComponent } from './features/search/search.component';
import { GridWrapperComponent } from './features/search/grid-wrapper/grid-wrapper.component';
import { HelpComponent } from './features/help/help.component';
import { InfoComponent } from './features/info/info.component';
import { SearchContentComponent } from './features/search/search-content/search-content.component';
import { LoginComponent } from './features/login/login.component';
import { RegistrationComponent } from './features/login/registration/registration.component';
import { JwtModule } from '@auth0/angular-jwt';
import { environment } from 'src/environments/environment';
import { UserLoggedInGuard } from './auth/logged-in.guard';
import { UserNotLoggedInGuard } from './auth/not-logged-in.guard';
import {TranslateModule, TranslateLoader} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import { PuterPlaceholderComponent } from './features/puter-placeholder/puter-placeholder.component';
import { SursilvanPlaceholderComponent } from './features/sursilvan-placeholder/sursilvan-placeholder.component';
import { ValladerPlaceholderComponent } from './features/vallader-placeholder/vallader-placeholder.component';

const TOKEN_KEY = 'jwt';
export function tokenGetter() {
  return localStorage.getItem(TOKEN_KEY);
}

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    LanguageSelectionComponent,
    MainComponent,
    FooterComponent,
    SearchComponent,
    GridWrapperComponent,
    HelpComponent,
    InfoComponent,
    SearchContentComponent,
    LoginComponent,
    RegistrationComponent,
    PuterPlaceholderComponent,
    SursilvanPlaceholderComponent,
    ValladerPlaceholderComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        allowedDomains: [environment.apiHost],
        disallowedRoutes: [environment.apiUrl + '/users/token']
      }
    }),
    TranslateModule.forRoot({
      loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient]
      },
      defaultLanguage: 'rm-rumgr'
  })
  ],
  providers: [
    UserLoggedInGuard,
    UserNotLoggedInGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
