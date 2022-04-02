import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserLoggedInGuard } from './auth/logged-in.guard';
import { UserNotLoggedInGuard } from './auth/not-logged-in.guard';
import { MainLayoutComponent } from './components/main-layout/main-layout.component';
import { IdiomNavigationComponent } from './components/navigation/idiom-navigation/idiom-navigation.component';
import { UsersNavigationComponent } from './components/navigation/users-navigation/users-navigation.component';
import { AdminComponent } from './features/admin/admin.component';
import { DbAdministrationComponent } from './features/admin/db-administration/db-administration.component';
import { IndexAdministrationComponent } from './features/admin/index-administration/index-administration.component';
import { EditorComponent } from './features/editor/editor.component';
import { HistoryComponent } from './features/editor/history/history.component';
import { LexiconComponent } from './features/editor/lexicon/lexicon.component';
import { ReviewAutoChangesComponent } from './features/editor/review-auto-changes/review-auto-changes.component';
import { SuggestionsComponent } from './features/editor/suggestions/suggestions.component';
import { LoginComponent } from './features/login/login.component';
import { UserAdministrationComponent } from './features/user-administration/user-administration.component';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [UserNotLoggedInGuard]
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
        path: 'puter',
        component: IdiomNavigationComponent,
        children: [
          {
            path: "editor",
            component: EditorComponent,
            children: [
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
                path: "automatic",
                component: ReviewAutoChangesComponent,
              },
            ]
          },
          {
            path: "admin",
            component: AdminComponent,
            children: [
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
        path: 'rumantschgrischun',
        component: IdiomNavigationComponent,
        children: [
          {
            path: "editor",
            component: EditorComponent,
            children: [
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
                path: "automatic",
                component: ReviewAutoChangesComponent,
              },
            ]
          },
          {
            path: "admin",
            component: AdminComponent,
            children: [
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
        component: IdiomNavigationComponent,
        children: [
          {
            path: "editor",
            component: EditorComponent,
            children: [
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
                path: "automatic",
                component: ReviewAutoChangesComponent,
              },
            ]
          },
          {
            path: "admin",
            component: AdminComponent,
            children: [
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
        component: IdiomNavigationComponent,
        children: [
          {
            path: "editor",
            component: EditorComponent,
            children: [
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
                path: "automatic",
                component: ReviewAutoChangesComponent,
              },
            ]
          },
          {
            path: "admin",
            component: AdminComponent,
            children: [
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
        component: IdiomNavigationComponent,
        children: [
          {
            path: "editor",
            component: EditorComponent,
            children: [
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
                path: "automatic",
                component: ReviewAutoChangesComponent,
              },
            ]
          },
          {
            path: "admin",
            component: AdminComponent,
            children: [
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
        component: IdiomNavigationComponent,
        children: [
          {
            path: "editor",
            component: EditorComponent,
            children: [
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
                path: "automatic",
                component: ReviewAutoChangesComponent,
              },
            ]
          },
          {
            path: "admin",
            component: AdminComponent,
            children: [
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
        component: UsersNavigationComponent,
        children: [
          {
            path: "",
            component: EditorComponent
          },
          {
            path: "admin",
            component: AdminComponent,
            children: [
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
        path: 'users',
        component: UsersNavigationComponent,
        children: [
          {
            path: "",
            component: UserAdministrationComponent
          },
          {
            path: "admin",
            component: AdminComponent,
            children: [
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
