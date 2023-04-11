import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PurchaseListComponent } from './pages/purchase-list/purchase-list.component';
import { SummaryComponent } from './pages/summary/summary.component';
import { PurchaseViewComponent } from './pages/purchase-view/purchase-view.component';
import { LayoutComponent } from './layout/layout.component';
import { PurchaseEditorNewComponent } from './pages/payment-editor/purchase/purchase-editor-new.component';
import { PurchaseEditorEditComponent } from './pages/payment-editor/purchase/purchase-editor-edit.component';
import { RegisterComponent } from './pages/register/register.component';
import { ReceiptProcessorComponent } from './pages/receipt-processor/receipt-processor.component';
import { ReceiptViewComponent } from './pages/receipt-view/receipt-view.component';
import { CompensationEditorNewComponent } from './pages/payment-editor/compensation/compensation-editor-new.component';
import { CompensationEditorEditComponent } from './pages/payment-editor/compensation/compensation-editor-edit.component';
import { AuthGuard } from '@auth0/auth0-angular';

export const routes: Routes = [
  {
    path: 'receipt/:purchaseId',
    component: ReceiptViewComponent,
    canActivate: [AuthGuard]
  },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        redirectTo: `/overview`,
        pathMatch: 'full'
      },
      {
        path: 'overview',
        component: PurchaseListComponent
      },
      {
        path: 'summary',
        component: SummaryComponent
      },
      {
        path: 'purchase/:purchaseId',
        component: PurchaseViewComponent
      },
      {
        path: 'new-purchase',
        component: PurchaseEditorNewComponent,
      },
      {
        path: 'edit-purchase/:purchaseId',
        component: PurchaseEditorEditComponent,
      },
      {
        path: 'new-compensation',
        component: CompensationEditorNewComponent
      },
      {
        path: 'edit-compensation/:purchaseId',
        component: CompensationEditorEditComponent
      },
      {
        path: 'scan-receipt',
        component: ReceiptProcessorComponent
      },
      {
        path: 'scan-receipt/:purchaseId',
        component: ReceiptProcessorComponent
      }
    ]
  },
  {
    path: 'register',
    component: RegisterComponent,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [
  ]
})
export class AppRoutingModule {
}
