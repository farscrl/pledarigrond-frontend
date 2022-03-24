import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserLoggedInGuard } from './auth/logged-in.guard';
import { UserNotLoggedInGuard } from './auth/not-logged-in.guard';
import { MainLayoutComponent } from './components/main-layout/main-layout.component';
import { IdiomNavigationComponent } from './components/navigation/idiom-navigation/idiom-navigation.component';
import { UsersNavigationComponent } from './components/navigation/users-navigation/users-navigation.component';
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
            path: "",
            component: UserAdministrationComponent
          }
        ]
      },
      {
        path: 'rumantschgrischun',
        component: IdiomNavigationComponent,
        children: [
          {
            path: "",
            component: UserAdministrationComponent
          }
        ]
      },
      {
        path: 'surmiran',
        component: IdiomNavigationComponent,
        children: [
          {
            path: "",
            component: UserAdministrationComponent
          }
        ]
      },
      {
        path: 'sursilvan',
        component: IdiomNavigationComponent,
        children: [
          {
            path: "",
            component: UserAdministrationComponent
          }
        ]
      },
      {
        path: 'sutsilvan',
        component: IdiomNavigationComponent,
        children: [
          {
            path: "",
            component: UserAdministrationComponent
          }
        ]
      },
      {
        path: 'vallader',
        component: IdiomNavigationComponent,
        children: [
          {
            path: "",
            component: UserAdministrationComponent
          }
        ]
      },
      {
        path: 'names',
        component: UsersNavigationComponent,
        children: [
          {
            path: "",
            component: UserAdministrationComponent
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
