import { enableProdMode, importProvidersFrom, isDevMode, provideZoneChangeDetection } from '@angular/core';
import { environment } from './environments/environment';
import { provideHttpClient, withInterceptorsFromDi, withXhr } from '@angular/common/http';
import { provideMatomo, withRouter } from 'ngx-matomo-client';
import { provideTranslateService } from '@ngx-translate/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { JwtModule } from '@auth0/angular-jwt';
import { provideServiceWorker } from '@angular/service-worker';
import { AppComponent } from './app/app.component';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';

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
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    }),
    importProvidersFrom(
      JwtModule.forRoot({
        config: {
          tokenGetter: tokenGetter,
          allowedDomains: [environment.apiHost],
          disallowedRoutes: [environment.apiUrl + '/users/token']
        }
      })
    ),
    provideHttpClient(withXhr(), withInterceptorsFromDi()),
    provideMatomo({
      siteId: environment.matomoTrackingId,
      trackerUrl: environment.matomoTrackingUrl,
    }, withRouter()),
    provideTranslateService({
      loader: provideTranslateHttpLoader({prefix:'./assets/i18n/', suffix:'.json'}),
      fallbackLang: 'rm-rumgr'
    })
  ]
})
  .catch(err => console.error(err));
