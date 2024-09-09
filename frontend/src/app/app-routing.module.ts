import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserNotLoggedInGuard } from './auth/not-logged-in.guard';
import { LoginComponent } from './features/login/login.component';
import { PuterPlaceholderComponent } from './features/puter-placeholder/puter-placeholder.component';
import { SearchComponent } from './features/search/search.component';
import { SpellcheckerComponent } from './features/spellchecker/spellchecker.component';
import { HelpRumgrComponent } from './features/static/help/rumgr/help-rumgr/help-rumgr.component';
import { HelpSurmiranComponent } from './features/static/help/surmiran/help-surmiran/help-surmiran.component';
import { HelpSutsilvComponent } from './features/static/help/sutsilv/help-sutsilv/help-sutsilv.component';
import { InfoRumgrComponent } from './features/static/info/rumgr/info-rumgr/info-rumgr.component';
import { InfoSurmiranComponent } from './features/static/info/surmiran/info-surmiran/info-surmiran.component';
import { InfoSutsilvComponent } from './features/static/info/sutsilv/info-sutsilv/info-sutsilv.component';
import { StaticComponent } from './features/static/static.component';
import { ValladerPlaceholderComponent } from './features/vallader-placeholder/vallader-placeholder.component';
import { InfoSursilvanComponent } from './features/static/info/sursilvan/info-sursilvan/info-sursilvan.component';
import { HelpSursilvanComponent } from './features/static/help/sursilvan/help-sursilvan/help-sursilvan.component';

const routes: Routes = [
  {
    path: 'puter',
    children: [
      {
        path: '',
        component: PuterPlaceholderComponent
      },
      {
        path: 'spellchecker',
        component: SpellcheckerComponent,
      },
    ]
  },
  {
    path: 'rumantschgrischun',
    children: [
      {
        path: '',
        component: SearchComponent
      },
      {
        path: 'spellchecker',
        component: SpellcheckerComponent,
      },
      {
        path: 'login',
        component: LoginComponent,
        canActivate: [UserNotLoggedInGuard]
      },
      {
        path: 'info',
        component: StaticComponent,
        children: [
          {
            path: "",
            component: InfoRumgrComponent
          }
        ]
      },
      {
        path: 'help',
        component: StaticComponent,
        children: [
          {
            path: "",
            component: HelpRumgrComponent
          }
        ]
      }
    ]
  },
  {
    path: 'surmiran',
    children: [
      {
        path: '',
        component: SearchComponent
      },
      {
        path: 'spellchecker',
        component: SpellcheckerComponent,
      },
      {
        path: 'login',
        component: LoginComponent,
        canActivate: [UserNotLoggedInGuard]
      },
      {
        path: 'info',
        component: StaticComponent,
        children: [
          {
            path: "",
            component: InfoSurmiranComponent
          }
        ]
      },
      {
        path: 'help',
        component: StaticComponent,
        children: [
          {
            path: "",
            component: HelpSurmiranComponent
          }
        ]
      }
    ]
  },
  {
    path: 'sursilvan',
    children: [
      {
        path: '',
        component: SearchComponent
      },
      {
        path: 'spellchecker',
        component: SpellcheckerComponent,
      },
      {
        path: 'login',
        component: LoginComponent,
        canActivate: [UserNotLoggedInGuard]
      },
      {
        path: 'info',
        component: StaticComponent,
        children: [
          {
            path: "",
            component: InfoSursilvanComponent
          }
        ]
      },
      {
        path: 'help',
        component: StaticComponent,
        children: [
          {
            path: "",
            component: HelpSursilvanComponent
          }
        ]
      }
    ]
  },
  {
    path: 'sutsilvan',
    children: [
      {
        path: '',
        component: SearchComponent
      },
      {
        path: 'spellchecker',
        component: SpellcheckerComponent,
      },
      {
        path: 'login',
        component: LoginComponent,
        canActivate: [UserNotLoggedInGuard]
      },
      {
        path: 'info',
        component: StaticComponent,
        children: [
          {
            path: "",
            component: InfoSutsilvComponent
          }
        ]
      },
      {
        path: 'help',
        component: StaticComponent,
        children: [
          {
            path: "",
            component: HelpSutsilvComponent
          }
        ]
      }
    ]
  },
  {
    path: 'vallader',
    children: [
      {
        path: '',
        component: ValladerPlaceholderComponent
      },
      {
        path: 'spellchecker',
        component: SpellcheckerComponent,
      },
    ]
  },
  {
    path: '**',
    redirectTo: 'rumantschgrischun'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
