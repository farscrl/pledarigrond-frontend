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
import { SearchOptionsComponent } from './features/search/search-options/search-options.component';
import { GlossaryLinksComponent } from './features/search/glossary-links/glossary-links.component';
import { RssFeedComponent } from './features/search/rss-feed/rss-feed.component';
import { StaticComponent } from './features/static/static.component';
import { HelpRumgrDeComponent } from './features/static/help/rumgr/help-rumgr-de/help-rumgr-de.component';
import { HelpRumgrRmComponent } from './features/static/help/rumgr/help-rumgr-rm/help-rumgr-rm.component';
import { HelpSurmiranRmComponent } from './features/static/help/surmiran/help-surmiran-rm/help-surmiran-rm.component';
import { HelpSurmiranDeComponent } from './features/static/help/surmiran/help-surmiran-de/help-surmiran-de.component';
import { HelpSutsilvDeComponent } from './features/static/help/sutsilv/help-sutsilv-de/help-sutsilv-de.component';
import { HelpSutsilvRmComponent } from './features/static/help/sutsilv/help-sutsilv-rm/help-sutsilv-rm.component';
import { InfoSutsilvRmComponent } from './features/static/info/sutsilv/info-sutsilv-rm/info-sutsilv-rm.component';
import { InfoSutsilvDeComponent } from './features/static/info/sutsilv/info-sutsilv-de/info-sutsilv-de.component';
import { InfoRumgrDeComponent } from './features/static/info/rumgr/info-rumgr-de/info-rumgr-de.component';
import { InfoRumgrRmComponent } from './features/static/info/rumgr/info-rumgr-rm/info-rumgr-rm.component';
import { InfoSurmiranRmComponent } from './features/static/info/surmiran/info-surmiran-rm/info-surmiran-rm.component';
import { InfoSurmiranComponent } from './features/static/info/surmiran/info-surmiran/info-surmiran.component';
import { InfoRumgrComponent } from './features/static/info/rumgr/info-rumgr/info-rumgr.component';
import { InfoSutsilvComponent } from './features/static/info/sutsilv/info-sutsilv/info-sutsilv.component';
import { HelpSutsilvComponent } from './features/static/help/sutsilv/help-sutsilv/help-sutsilv.component';
import { HelpSurmiranComponent } from './features/static/help/surmiran/help-surmiran/help-surmiran.component';
import { HelpRumgrComponent } from './features/static/help/rumgr/help-rumgr/help-rumgr.component';
import { InfoSurmiranDeComponent } from './features/static/info/surmiran/info-surmiran-de/info-surmiran-de.component';

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
    SearchContentComponent,
    LoginComponent,
    RegistrationComponent,
    PuterPlaceholderComponent,
    SursilvanPlaceholderComponent,
    ValladerPlaceholderComponent,
    SearchOptionsComponent,
    GlossaryLinksComponent,
    RssFeedComponent,
    StaticComponent,
    HelpRumgrDeComponent,
    HelpRumgrRmComponent,
    HelpSurmiranRmComponent,
    HelpSurmiranDeComponent,
    HelpSutsilvDeComponent,
    HelpSutsilvRmComponent,
    InfoSutsilvRmComponent,
    InfoSutsilvDeComponent,
    InfoRumgrDeComponent,
    InfoRumgrRmComponent,
    InfoSurmiranRmComponent,
    InfoSurmiranComponent,
    InfoRumgrComponent,
    InfoSutsilvComponent,
    HelpSutsilvComponent,
    HelpSurmiranComponent,
    HelpRumgrComponent,
    InfoSurmiranDeComponent
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
