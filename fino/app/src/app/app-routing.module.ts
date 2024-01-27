import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ToolbarLayoutComponent } from './components/layout/toolbar-layout.component';
import { LoginPageComponent } from './pages/login/login-page.component';
import { isAuthenticated, LOGIN_PATH } from './services/auth.service';
import { PurchaseListPageComponent } from './pages/purchase-list/purchase-list-page.component';
import { EmptyLayoutComponent } from './components/layout/empty-layout.component';
import { PURCHASE_ID_PATH_ID, PurchaseViewComponent } from './pages/payment-view/purchase-view.component';
import { PurchaseEditorEditComponent } from './pages/payment-editor/purchase-editor-edit.component';
import { NewPurchaseStepperComponent } from './pages/new-purchase-stepper/new-purchase-stepper.component';

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
          { path: 'new-purchase', component: NewPurchaseStepperComponent },
          { path: `:${'id'}`, component: PurchaseEditorEditComponent },
        ]
      },
      {
        path: '',
        component: ToolbarLayoutComponent,
        canActivate: [isAuthenticated],
        children: [
          {
            path: 'purchases',
            children: [
              { path: `:${PURCHASE_ID_PATH_ID}`, component: PurchaseViewComponent },
              { path: '', component: PurchaseListPageComponent },
            ]
          },
          { path: '', pathMatch: 'full', redirectTo: '/purchases' }
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
