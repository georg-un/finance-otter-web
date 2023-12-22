import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ToolbarLayoutComponent } from './components/layout/toolbar-layout.component';
import { LoginPageComponent } from './pages/login/login-page.component';
import { isAuthenticated, LOGIN_PATH } from './services/auth.service';
import { PurchaseListPageComponent } from './pages/purchase-list/purchase-list-page.component';
import { PurchaseEditorComponent } from './pages/payment-editor/purchase-editor.component';
import { EmptyLayoutComponent } from './components/layout/empty-layout.component';

const routes: Routes = [
  {
    path: '',
    children: [
      { path: LOGIN_PATH, component: LoginPageComponent },
      {
        path: 'edit',
        component: EmptyLayoutComponent,
        canActivate: [isAuthenticated],
        children: [
          { path: 'new', component: PurchaseEditorComponent }
        ]
      },
      {
        path: '',
        component: ToolbarLayoutComponent,
        canActivate: [isAuthenticated],
        children: [
          { path: 'purchases', component: PurchaseListPageComponent }
        ]
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
