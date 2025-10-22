import { enableProdMode, importProvidersFrom, isDevMode } from '@angular/core';
import { environment } from './environments/environment';
import { UserLoggedInGuard } from './app/auth/logged-in.guard';
import { UserNotLoggedInGuard } from './app/auth/not-logged-in.guard';
import { interceptorProviders } from './app/auth/interceptors';
import { de_DE, NZ_I18N } from 'ng-zorro-antd/i18n';
import { FileUtils } from './app/utils/file.utils';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { bootstrapApplication, BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app/app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { IconDirective } from '@ant-design/icons-angular';
import { JwtModule } from '@auth0/angular-jwt';
import { TranslateModule } from '@ngx-translate/core';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';
import { NgxSortableModule } from 'ngx-sortable';
import { NzFlexDirective } from 'ng-zorro-antd/flex';
import { ServiceWorkerModule } from '@angular/service-worker';
import { AppComponent } from './app/app.component';
import { registerLocaleData } from '@angular/common';
import de from '@angular/common/locales/de';
import { NzModalModule } from 'ng-zorro-antd/modal';

registerLocaleData(de);

const TOKEN_KEY = 'jwt';
export function tokenGetter() {
  return localStorage.getItem(TOKEN_KEY);
}

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(BrowserModule, AppRoutingModule, FormsModule, IconDirective, JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        allowedDomains: [environment.apiHost],
        disallowedRoutes: [environment.apiUrl + '/users/token']
      }
    }), ReactiveFormsModule, TranslateModule.forRoot({
      fallbackLang: 'rm-rumgr',
      loader: provideTranslateHttpLoader({ prefix: './assets/i18n/', suffix: '.json' }),
    }), NgxSortableModule, NzFlexDirective, ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    })),
    UserLoggedInGuard,
    UserNotLoggedInGuard,
    interceptorProviders,
    { provide: NZ_I18N, useValue: de_DE },
    FileUtils,
    provideHttpClient(withInterceptorsFromDi()),
    provideNoopAnimations(),
    importProvidersFrom(NzModalModule),
  ]
})
  .catch(err => console.error(err));
