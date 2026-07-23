import { enableProdMode, importProvidersFrom, isDevMode, provideZoneChangeDetection } from '@angular/core';
import { environment } from './environments/environment';
import { interceptorProviders } from './app/auth/interceptors';
import { de_DE, NZ_I18N } from 'ng-zorro-antd/i18n';
import { provideHttpClient, withInterceptorsFromDi, withXhr } from '@angular/common/http';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { provideJwtConfig } from '@jjmhalew/angular-jwt';
import { provideTranslateService } from '@ngx-translate/core';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';
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
    provideJwtConfig({
      tokenGetter: tokenGetter,
      allowedDomains: [environment.apiHost],
      disallowedRoutes: [environment.apiUrl + '/users/token']
    }),
    interceptorProviders,
    { provide: NZ_I18N, useValue: de_DE },
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
