import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './components/layout/layout.component';
import { LoginPageComponent } from './pages/login/login-page.component';
import { isAuthenticated, LOGIN_PATH } from '../services/auth.service';

const routes: Routes = [
  {
    path: '',
    children: [
      { path: LOGIN_PATH, component: LoginPageComponent },
      {
        path: '',
        component: LayoutComponent,
        canActivate: [isAuthenticated],
        children: [
        ]
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
