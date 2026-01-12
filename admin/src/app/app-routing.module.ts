import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserLoggedInGuard } from './auth/logged-in.guard';
import { UserNotLoggedInGuard } from './auth/not-logged-in.guard';
import { MainLayoutComponent } from './components/main-layout/main-layout.component';
import { AdminComponent } from './features/admin/admin.component';
import { DbAdministrationComponent } from './features/admin/db-administration/db-administration.component';
import { IndexAdministrationComponent } from './features/admin/index-administration/index-administration.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { EditorComponent } from './features/editor/editor.component';
import { HistoryComponent } from './features/editor/history/history.component';
import { LexiconComponent } from './features/editor/lexicon/lexicon.component';
import { SuggestionsComponent } from './features/editor/suggestions/suggestions.component';
import { LoginComponent } from './features/login/login.component';
import { NoPermissionsComponent } from './features/no-permissions/no-permissions.component';
import { UserAdministrationComponent } from './features/user-administration/user-administration.component';
import { NameAdministrationComponent } from "./features/name-administration/name-administration.component";
import { ReviewPronunciationComponent } from './features/editor/review-pronunciation/review-pronunciation.component';
import { Language } from './models/security';
import { LanguageResolver } from './resolver/language.resolver';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [UserNotLoggedInGuard]
  },
  {
    path: 'no-permissions',
    component: NoPermissionsComponent
  },
  {
    path: 'admin',
    component: MainLayoutComponent,
    canActivate: [UserLoggedInGuard],
    data: {
      redirectToLogin: true,
    },
    children: [
      {
        path: "",
        component: DashboardComponent
      },
      {
        path: 'rumantschgrischun',
        canActivate: [UserLoggedInGuard],
        resolve: { lang: LanguageResolver },
        data: {
          currentLanguage: Language.RUMANTSCHGRISCHUN,
          expected_role: 'ROLE_EDITOR_RUMANTSCHGRISCHUN'
        },
        children: [
          {
            path: "",
            redirectTo: "editor",
            pathMatch: 'full',
          },
          {
            path: "editor",
            component: EditorComponent,
            children: [
              {
                path: "",
                redirectTo: "suggestions",
                pathMatch: 'full',
              },
              {
                path: "suggestions",
                component: SuggestionsComponent,
              },
              {
                path: "history",
                component: HistoryComponent,
              },
              {
                path: "lexicon",
                component: LexiconComponent,
              },
              {
                path: "pronunciation",
                component: ReviewPronunciationComponent,
              }
            ]
          },
          {
            path: "admin",
            component: AdminComponent,
            children: [
              {
                path: "",
                redirectTo: "database",
                pathMatch: 'full',
              },
              {
                path: "database",
                component: DbAdministrationComponent
              },
              {
                path: "index",
                component: IndexAdministrationComponent
              }
            ]
          }
        ]
      },
      {
        path: 'sursilvan',
        canActivate: [UserLoggedInGuard],
        resolve: { lang: LanguageResolver },
        data: {
          currentLanguage: Language.SURSILVAN,
          expected_role: 'ROLE_EDITOR_SURSILVAN'
        },
        children: [
          {
            path: "",
            redirectTo: "editor",
            pathMatch: 'full',
          },
          {
            path: "editor",
            component: EditorComponent,
            children: [
              {
                path: "",
                redirectTo: "suggestions",
                pathMatch: 'full',
              },
              {
                path: "suggestions",
                component: SuggestionsComponent,
              },
              {
                path: "history",
                component: HistoryComponent,
              },
              {
                path: "lexicon",
                component: LexiconComponent,
              },
              {
                path: "pronunciation",
                component: ReviewPronunciationComponent,
              }
            ]
          },
          {
            path: "admin",
            component: AdminComponent,
            children: [
              {
                path: "",
                redirectTo: "database",
                pathMatch: 'full',
              },
              {
                path: "database",
                component: DbAdministrationComponent
              },
              {
                path: "index",
                component: IndexAdministrationComponent
              }
            ]
          }
        ]
      },
      {
        path: 'surmiran',
        canActivate: [UserLoggedInGuard],
        resolve: { lang: LanguageResolver },
        data: {
          currentLanguage: Language.SURMIRAN,
          expected_role: 'ROLE_EDITOR_SURMIRAN'
        },
        children: [
          {
            path: "",
            redirectTo: "editor",
            pathMatch: 'full',
          },
          {
            path: "editor",
            component: EditorComponent,
            children: [
              {
                path: "",
                redirectTo: "suggestions",
                pathMatch: 'full',
              },
              {
                path: "suggestions",
                component: SuggestionsComponent,
              },
              {
                path: "history",
                component: HistoryComponent,
              },
              {
                path: "lexicon",
                component: LexiconComponent,
              },
              {
                path: "pronunciation",
                component: ReviewPronunciationComponent,
              }
            ]
          },
          {
            path: "admin",
            component: AdminComponent,
            children: [
              {
                path: "",
                redirectTo: "database",
                pathMatch: 'full',
              },
              {
                path: "database",
                component: DbAdministrationComponent
              },
              {
                path: "index",
                component: IndexAdministrationComponent
              }
            ]
          }
        ]
      },
      {
        path: 'puter',
        canActivate: [UserLoggedInGuard],
        resolve: { lang: LanguageResolver },
        data: {
          currentLanguage: Language.PUTER,
          expected_role: 'ROLE_EDITOR_PUTER'
        },
        children: [
          {
            path: "",
            redirectTo: "editor",
            pathMatch: 'full',
          },
          {
            path: "editor",
            component: EditorComponent,
            children: [
              {
                path: "",
                redirectTo: "suggestions",
                pathMatch: 'full',
              },
              {
                path: "suggestions",
                component: SuggestionsComponent,
              },
              {
                path: "history",
                component: HistoryComponent,
              },
              {
                path: "lexicon",
                component: LexiconComponent,
              },
              {
                path: "pronunciation",
                component: ReviewPronunciationComponent,
              }
            ]
          },
          {
            path: "admin",
            component: AdminComponent,
            children: [
              {
                path: "",
                redirectTo: "database",
                pathMatch: 'full',
              },
              {
                path: "database",
                component: DbAdministrationComponent
              },
              {
                path: "index",
                component: IndexAdministrationComponent
              }
            ]
          }
        ]
      },
      {
        path: 'vallader',
        canActivate: [UserLoggedInGuard],
        resolve: { lang: LanguageResolver },
        data: {
          currentLanguage: Language.VALLADER,
          expected_role: 'ROLE_EDITOR_VALLADER'
        },
        children: [
          {
            path: "",
            redirectTo: "editor",
            pathMatch: 'full',
          },
          {
            path: "editor",
            component: EditorComponent,
            children: [
              {
                path: "",
                redirectTo: "suggestions",
                pathMatch: 'full',
              },
              {
                path: "suggestions",
                component: SuggestionsComponent,
              },
              {
                path: "history",
                component: HistoryComponent,
              },
              {
                path: "lexicon",
                component: LexiconComponent,
              },
              {
                path: "pronunciation",
                component: ReviewPronunciationComponent,
              }
            ]
          },
          {
            path: "admin",
            component: AdminComponent,
            children: [
              {
                path: "",
                redirectTo: "database",
                pathMatch: 'full',
              },
              {
                path: "database",
                component: DbAdministrationComponent
              },
              {
                path: "index",
                component: IndexAdministrationComponent
              }
            ]
          }
        ]
      },
      {
        path: 'sutsilvan',
        canActivate: [UserLoggedInGuard],
        resolve: { lang: LanguageResolver },
        data: {
          currentLanguage: Language.SUTSILVAN,
          expected_role: 'ROLE_EDITOR_SUTSILVAN'
        },
        children: [
          {
            path: "",
            redirectTo: "editor",
            pathMatch: 'full',
          },
          {
            path: "editor",
            component: EditorComponent,
            children: [
              {
                path: "",
                redirectTo: "suggestions",
                pathMatch: 'full',
              },
              {
                path: "suggestions",
                component: SuggestionsComponent,
              },
              {
                path: "history",
                component: HistoryComponent,
              },
              {
                path: "lexicon",
                component: LexiconComponent,
              },
              {
                path: "pronunciation",
                component: ReviewPronunciationComponent,
              }
            ]
          },
          {
            path: "admin",
            component: AdminComponent,
            children: [
              {
                path: "",
                redirectTo: "database",
                pathMatch: 'full',
              },
              {
                path: "database",
                component: DbAdministrationComponent
              },
              {
                path: "index",
                component: IndexAdministrationComponent
              }
            ]
          }
        ]
      },
      {
        path: 'names',
        canActivate: [UserLoggedInGuard],
        data: {
          expected_role: 'ROLE_EDITOR_NAMES'
        },
        children: [
          {
            path: "",
            component: NameAdministrationComponent
          }
        ]
      },
      {
        path: 'users',canActivate: [UserLoggedInGuard],
        data: {
          expected_role: 'ROLE_ADMIN'
        },
        children: [
          {
            path: "",
            component: UserAdministrationComponent
          }
        ]
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'admin'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
