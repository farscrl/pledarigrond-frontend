import { enableProdMode, importProvidersFrom, isDevMode } from '@angular/core';
import { environment } from './environments/environment';
import { UserLoggedInGuard } from './app/auth/logged-in.guard';
import { UserNotLoggedInGuard } from './app/auth/not-logged-in.guard';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { LanguageUtils } from './app/utils/language-utils';
import { MatomoTrackClickDirective, provideMatomo, withRouter } from 'ngx-matomo-client';
import { provideTranslateService, TranslateDirective, TranslatePipe } from '@ngx-translate/core';
import { bootstrapApplication, BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app/app-routing.module';
import { FormsModule } from '@angular/forms';
import { JwtModule } from '@auth0/angular-jwt';
import { defaultNgxModalOptions, NgxModalView } from 'ngx-modalview';
import { ServiceWorkerModule } from '@angular/service-worker';
import { TiptapEditorDirective } from 'ngx-tiptap';
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
        importProvidersFrom(BrowserModule, AppRoutingModule, FormsModule, JwtModule.forRoot({
            config: {
                tokenGetter: tokenGetter,
                allowedDomains: [environment.apiHost],
                disallowedRoutes: [environment.apiUrl + '/users/token']
            }
        }), NgxModalView.forRoot({ container: 'modal-container' }, {
            ...defaultNgxModalOptions,
            ...{
                closeOnEscape: true,
                closeOnClickOutside: true,
                wrapperDefaultClasses: 'pg-modal pg-modal--fade',
                wrapperClass: 'pg-modal--fade-in',
                animationDuration: 0,
                autoFocus: false
            }
        }), ServiceWorkerModule.register('ngsw-worker.js', {
            enabled: !isDevMode(),
            // Register the ServiceWorker as soon as the application is stable
            // or after 30 seconds (whichever comes first).
            registrationStrategy: 'registerWhenStable:30000'
        }), TranslatePipe, TranslateDirective, MatomoTrackClickDirective, TiptapEditorDirective),
        UserLoggedInGuard,
        UserNotLoggedInGuard,
        provideHttpClient(withInterceptorsFromDi()),
        LanguageUtils,
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
