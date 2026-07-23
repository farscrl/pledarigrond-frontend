import { enableProdMode, importProvidersFrom, isDevMode, provideZoneChangeDetection } from '@angular/core';
import { environment } from './environments/environment';
import { UserLoggedInGuard } from './app/auth/logged-in.guard';
import { UserNotLoggedInGuard } from './app/auth/not-logged-in.guard';
import { interceptorProviders } from './app/auth/interceptors';
import { de_DE, NZ_I18N } from 'ng-zorro-antd/i18n';
import { FileUtils } from './app/utils/file.utils';
import { provideHttpClient, withInterceptorsFromDi, withXhr } from '@angular/common/http';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { JwtModule } from '@auth0/angular-jwt';
import { provideTranslateService } from '@ngx-translate/core';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';
import { NgxSortableModule } from 'ngx-sortable';
import { NzFlexDirective } from 'ng-zorro-antd/flex';
import { provideServiceWorker } from '@angular/service-worker';
import { AppComponent } from './app/app.component';
import { registerLocaleData } from '@angular/common';
import de from '@angular/common/locales/de';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { provideNzDateFnsAdapter } from 'ng-zorro-antd/core/time';

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
    provideZoneChangeDetection(),
    provideRouter(routes),
    importProvidersFrom(
      JwtModule.forRoot({
        config: {
          tokenGetter: tokenGetter,
          allowedDomains: [environment.apiHost],
          disallowedRoutes: [environment.apiUrl + '/users/token']
        }
      }),
      NgxSortableModule,
      NzFlexDirective),
    UserLoggedInGuard,
    UserNotLoggedInGuard,
    interceptorProviders,
    { provide: NZ_I18N, useValue: de_DE },
    FileUtils,
    provideHttpClient(withXhr(), withInterceptorsFromDi()),
    importProvidersFrom(NzModalModule),
    provideNzDateFnsAdapter(),
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    }),
    provideTranslateService({
      loader: provideTranslateHttpLoader({ prefix: './assets/i18n/', suffix: '.json' }),
      fallbackLang: 'rm-rumgr'
    }),
  ]
})
  .catch(err => console.error(err));
