import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserNotLoggedInGuard } from './auth/not-logged-in.guard';
import { LoginComponent } from './features/login/login.component';
import { SearchComponent } from './features/search/search.component';

const routes: Routes = [
  {
    path: 'puter',
    children: [
      {
        path: '',
        component: SearchComponent
      },
      {
        path: 'login',
        component: LoginComponent,
        canActivate: [UserNotLoggedInGuard]
      }
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
        path: 'login',
        component: LoginComponent,
        canActivate: [UserNotLoggedInGuard]
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
        path: 'login',
        component: LoginComponent,
        canActivate: [UserNotLoggedInGuard]
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
        path: 'login',
        component: LoginComponent,
        canActivate: [UserNotLoggedInGuard]
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
        path: 'login',
        component: LoginComponent,
        canActivate: [UserNotLoggedInGuard]
      }
    ]
  },
  {
    path: 'vallader',
    children: [
      {
        path: '',
        component: SearchComponent
      },
      {
        path: 'login',
        component: LoginComponent,
        canActivate: [UserNotLoggedInGuard]
      }
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
