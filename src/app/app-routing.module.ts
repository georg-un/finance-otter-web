import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TransactionsComponent } from './transactions/transactions.component';
import { OverviewComponent } from './overview/overview.component';
import { PaymentViewComponent } from './payment-view/payment-view.component';
import { LayoutComponent } from './layout/layout.component';
import { PaymentEditorComponent } from './payment-editor/payment-editor.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        redirectTo: `/transactions`,
        pathMatch: 'full'
      },
      {
        path: 'transactions',
        component: TransactionsComponent
      },
      {
        path: 'overview',
        component: OverviewComponent
      },
      {
        path: 'payment',
        component: PaymentViewComponent
      },
      {
        path: 'edit',
        component: PaymentEditorComponent
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
