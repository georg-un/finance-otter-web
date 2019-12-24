import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PaymentListComponent } from './payment-list/payment-list.component';
import { SummaryComponent } from './summary/summary.component';
import { PaymentViewComponent } from './payment-view/payment-view.component';
import { LayoutComponent } from './layout/layout.component';
import { PaymentEditorNewComponent } from './payment-editor/payment-editor-new.component';
import { PaymentEditorEditComponent } from './payment-editor/payment-editor-edit.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        redirectTo: `/overview`,
        pathMatch: 'full'
      },
      {
        path: 'overview',
        component: PaymentListComponent
      },
      {
        path: 'summary',
        component: SummaryComponent
      },
      {
        path: 'payment/:paymentId',
        component: PaymentViewComponent
      },
      {
        path: 'new',
        component: PaymentEditorNewComponent
      },
      {
        path: 'edit/:paymentId',
        component: PaymentEditorEditComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
