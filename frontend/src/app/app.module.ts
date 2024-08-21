import { isDevMode, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClient, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { defaultNgxModalOptions, NgxModalView } from 'ngx-modalview';
import { NgxTiptapModule } from 'ngx-tiptap';

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
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
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
import { SuggestionComponent } from './components/footer/suggestion/suggestion.component';
import { SuggestModificationComponent } from './features/search/suggest-modification/suggest-modification.component';
import { DetailsModalComponent } from './features/search/details-modal/details-modal.component';
import { ExportComponent } from './features/export/export.component';
import { TranslateCutPipe } from './pipes/translate-cut.pipe';
import { HighlighterPipe } from './pipes/highlighter.pipe';
import { LanguageUtils } from './utils/language-utils';
import { OtherResourcesComponent } from './features/other-resources/other-resources.component';
import { AutofocusDirective } from './directives/autofocus.directive';
import { SpellcheckerComponent } from './features/spellchecker/spellchecker.component';
import {
  SpellcheckerMenubarComponent
} from './features/spellchecker/spellchecker-menubar/spellchecker-menubar.component';
import { MatomoModule } from 'ngx-matomo-client';
import {
  ManualsSpellcheckerComponent
} from './features/spellchecker/manuals-spellchecker/manuals-spellchecker.component';
import { ManualMacosComponent } from './features/spellchecker/manuals-spellchecker/manual-macos/manual-macos.component';
import {
  ManualHunspellComponent
} from './features/spellchecker/manuals-spellchecker/manual-hunspell/manual-hunspell.component';
import { ManualWordComponent } from './features/spellchecker/manuals-spellchecker/manual-word/manual-word.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { ThousandSeparatorPipe } from './pipes/thousand-separator.pipe';
import { DetailsVerbComponent } from './features/search/details-modal/details-verb/details-verb.component';
import { DetailsAdjComponent } from './features/search/details-modal/details-adj/details-adj.component';
import { DetailsSubstComponent } from './features/search/details-modal/details-subst/details-subst.component';
import {
  ConjugationPersonalComponent
} from './features/search/details-modal/details-verb/conjugation-personal/conjugation-personal.component';
import {
  ConjugationImpersonalComponent
} from './features/search/details-modal/details-verb/conjugation-impersonal/conjugation-impersonal.component';
import { DetailsExampleComponent } from './features/search/details-modal/details-example/details-example.component';

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
    InfoSurmiranDeComponent,
    SuggestionComponent,
    SuggestModificationComponent,
    DetailsModalComponent,
    ExportComponent,
    TranslateCutPipe,
    HighlighterPipe,
    ThousandSeparatorPipe,
    OtherResourcesComponent,
    AutofocusDirective,
    SpellcheckerComponent,
    SpellcheckerMenubarComponent,
    ManualsSpellcheckerComponent,
    ManualMacosComponent,
    ManualHunspellComponent,
    ManualWordComponent,
    DetailsVerbComponent,
    DetailsSubstComponent,
    DetailsAdjComponent,
    DetailsExampleComponent,
    ConjugationPersonalComponent,
    ConjugationImpersonalComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
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
    }),
    NgxModalView.forRoot(
      {container: 'modal-container'},
      {
        ...defaultNgxModalOptions,
        ...{
          closeOnEscape: true,
          closeOnClickOutside: true,
          wrapperDefaultClasses: 'pg-modal pg-modal--fade',
          wrapperClass: 'pg-modal--fade-in',
          animationDuration: 0,
          autoFocus: false
        }
      }
    ),
    NgxTiptapModule,
    MatomoModule.forRoot({
      siteId: environment.matomoTrackingId,
      trackerUrl: environment.matomoTrackingUrl,
    }),
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    }),
  ],
  providers: [
    UserLoggedInGuard,
    UserNotLoggedInGuard,
    provideHttpClient(withInterceptorsFromDi()),
    LanguageUtils
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
