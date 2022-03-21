import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SearchComponent } from './features/search/search.component';

const routes: Routes = [
  {
    path: 'rumantschgrischun',
    children: [
      {
        path: '',
        component: SearchComponent
      }
    ]
  },
  {
    path: 'surmiran',
    children: [
      {
        path: '',
        component: SearchComponent
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
