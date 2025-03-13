import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { de_DE, NZ_I18N } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import de from '@angular/common/locales/de';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NgZorroAntdModule } from './ng-zorro-antd.module';
import { HeaderComponent } from './components/header/header.component';
import { LoginComponent } from './features/login/login.component';
import { MainLayoutComponent } from './components/main-layout/main-layout.component';
import { UserAdministrationComponent } from './features/user-administration/user-administration.component';
import { UserLoggedInGuard } from './auth/logged-in.guard';
import { UserNotLoggedInGuard } from './auth/not-logged-in.guard';
import { environment } from 'src/environments/environment';
import { JwtModule } from '@auth0/angular-jwt';
import { EditComponent } from './features/user-administration/edit/edit.component';
import { DbAdministrationComponent } from './features/admin/db-administration/db-administration.component';
import { EditorComponent } from './features/editor/editor.component';
import { AdminComponent } from './features/admin/admin.component';
import { IndexAdministrationComponent } from './features/admin/index-administration/index-administration.component';
import { ImportDumpComponent } from './features/admin/db-administration/import-dump/import-dump.component';
import { SuggestionsComponent } from './features/editor/suggestions/suggestions.component';
import { LexiconComponent } from './features/editor/lexicon/lexicon.component';
import { ReviewAutoChangesComponent } from './features/editor/review-auto-changes/review-auto-changes.component';
import { HistoryComponent } from './features/editor/history/history.component';
import { DurationComponent } from './components/filters/duration/duration.component';
import { VersionHistoryComponent } from './components/version-history/version-history.component';
import { DictionaryListComponent } from './components/dictionary-list/dictionary-list.component';
import { LexiconFilterComponent } from './components/filters/lexicon-filter/lexicon-filter.component';
import { ExportComponent } from './features/editor/export/export.component';
import { NavigationHorizontalComponent } from './components/navigation-horizontal/navigation-horizontal.component';
import { UserRoleComponent } from './components/data/user-role/user-role.component';
import { StatusComponent } from './components/data/status/status.component';
import { VerificationComponent } from './components/data/verification/verification.component';
import { MainEntryComponent } from './features/modify-entry/main-entry/main-entry.component';
import { interceptorProviders } from './auth/interceptors';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { ConjugationComponent } from './features/modify-entry/conjugation/conjugation.component';
import { ExportDumpComponent } from './features/admin/db-administration/export-dump/export-dump.component';
import { FileUtils } from './utils/file.utils';
import { ChangeSortOrderComponent } from './features/change-sort-order/change-sort-order.component';
import { NgxSortableModule } from 'ngx-sortable'
import { HighlighterPipe } from './pipes/highlighter.pipe';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { IdiomCardComponent } from './features/dashboard/idiom-card/idiom-card.component';
import { NoPermissionsComponent } from './features/no-permissions/no-permissions.component';
import { NounGenerationComponent } from './features/modify-entry/noun-generation/noun-generation.component';
import { DiffComponent } from './components/diff/diff.component';
import {
  AdjectiveGenerationComponent
} from './features/modify-entry/adjective-generation/adjective-generation.component';
import { NameAdministrationComponent } from "./features/name-administration/name-administration.component";
import { EditNameComponent } from "./features/name-administration/edit-name/edit-name.component";
import { NameCategoryComponent } from "./components/data/name-category/name-category.component";
import { NameDisplayComponent } from "./components/data/name-display/name-display.component";
import { LemmaDiffComponent } from "./components/lemma-diff/lemma-diff.component";
import { DiffModalComponent } from "./features/diff-modal/diff-modal.component";
import { PronounGenerationComponent } from "./features/modify-entry/pronoun-generation/pronoun-generation.component";
import { HeaderLadinComponent } from "./components/header-ladin/header-ladin.component";
import {
  PronunciationCharactersComponent
} from "./components/pronunciation-characters/pronunciation-characters.component";
import { OtherGenerationComponent } from './features/modify-entry/other-generation/other-generation.component';
import { ReviewPronunciationComponent } from './features/editor/review-pronunciation/review-pronunciation.component';
import { AudioPlayerComponent } from './components/audio-player/audio-player.component';
import { PronunciationComponent } from './features/modify-entry/pronunciation/pronunciation.component';
import { NzFlexDirective } from 'ng-zorro-antd/flex';
import { RegistrationStatusComponent } from './components/data/registration-status/registration-status.component';
import { FindCorpusEntryComponent } from './features/modify-entry/find-corpus-entry/find-corpus-entry.component';

registerLocaleData(de);

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

const TOKEN_KEY = 'jwt';
export function tokenGetter() {
  return localStorage.getItem(TOKEN_KEY);
}
@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HeaderLadinComponent,
    LoginComponent,
    MainLayoutComponent,
    UserAdministrationComponent,
    EditComponent,
    DbAdministrationComponent,
    EditorComponent,
    AdminComponent,
    IndexAdministrationComponent,
    ImportDumpComponent,
    SuggestionsComponent,
    LexiconComponent,
    ReviewAutoChangesComponent,
    HistoryComponent,
    DurationComponent,
    VersionHistoryComponent,
    DictionaryListComponent,
    LexiconFilterComponent,
    ExportComponent,
    NavigationHorizontalComponent,
    UserRoleComponent,
    StatusComponent,
    VerificationComponent,
    MainEntryComponent,
    ConjugationComponent,
    ExportDumpComponent,
    ChangeSortOrderComponent,
    HighlighterPipe,
    DashboardComponent,
    IdiomCardComponent,
    NoPermissionsComponent,
    NounGenerationComponent,
    DiffComponent,
    AdjectiveGenerationComponent,
    NameAdministrationComponent,
    EditNameComponent,
    NameCategoryComponent,
    NameDisplayComponent,
    LemmaDiffComponent,
    DiffModalComponent,
    PronounGenerationComponent,
    PronunciationCharactersComponent,
    OtherGenerationComponent,
    ReviewPronunciationComponent,
    AudioPlayerComponent,
    PronunciationComponent,
    RegistrationStatusComponent,
    FindCorpusEntryComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    NoopAnimationsModule,
    NgZorroAntdModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        allowedDomains: [environment.apiHost],
        disallowedRoutes: [environment.apiUrl + '/users/token']
      }
    }),
    ReactiveFormsModule,
    TranslateModule.forRoot({
      defaultLanguage: 'rm-rumgr',
      loader: {
        provide: TranslateLoader,
        useFactory: (HttpLoaderFactory),
        deps: [HttpClient]
      }
    }),
    NgxSortableModule,
    NzFlexDirective,
  ],
  providers: [
    UserLoggedInGuard,
    UserNotLoggedInGuard,
    interceptorProviders,
    { provide: NZ_I18N, useValue: de_DE },
    FileUtils,
    provideHttpClient(withInterceptorsFromDi()),
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
