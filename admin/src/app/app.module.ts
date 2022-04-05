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
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
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
import { LemmaListComponent } from './components/lemma-list/lemma-list.component';
import { LexiconFilterComponent } from './components/filters/lexicon-filter/lexicon-filter.component';
import { ExportComponent } from './features/editor/export/export.component';
import { NoopAnimationPlayer } from '@angular/animations';
import { NavigationHorizontalComponent } from './components/navigation-horizontal/navigation-horizontal.component';

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
    LemmaListComponent,
    LexiconFilterComponent,
    ExportComponent,
    NavigationHorizontalComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
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
  ],
  providers: [
    UserLoggedInGuard,
    UserNotLoggedInGuard,
    { provide: NZ_I18N, useValue: de_DE }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
