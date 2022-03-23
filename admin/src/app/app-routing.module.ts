import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserLoggedInGuard } from './auth/logged-in.guard';
import { UserNotLoggedInGuard } from './auth/not-logged-in.guard';
import { MainLayoutComponent } from './components/main-layout/main-layout.component';
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
        component: UserAdministrationComponent
      },
      {
        path: 'rumantschgrischun',
        component: UserAdministrationComponent
      },
      {
        path: 'surmiran',
        component: UserAdministrationComponent
      },
      {
        path: 'sursilvan',
        component: UserAdministrationComponent
      },
      {
        path: 'puter',
        component: UserAdministrationComponent
      },
      {
        path: 'vallader',
        component: UserAdministrationComponent
      },
      {
        path: 'nums',
        component: UserAdministrationComponent
      },
      {
        path: 'users',
        component: UserAdministrationComponent
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
