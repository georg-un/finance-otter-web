import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PurchaseListComponent } from './pages/purchase-list/purchase-list.component';
import { SummaryComponent } from './pages/summary/summary.component';
import { PurchaseViewComponent } from './pages/purchase-view/purchase-view.component';
import { LayoutComponent } from './layout/layout.component';
import { PurchaseEditorNewComponent } from './pages/purchase-editor/purchase-editor-new.component';
import { PurchaseEditorEditComponent } from './pages/purchase-editor/purchase-editor-edit.component';
import { AuthGuard } from './auth.guard';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { InterceptorService } from './core/interceptor.service';
import { RegisterComponent } from './pages/register/register.component';
import { ReceiptProcessorComponent } from './pages/receipt-processor/receipt-processor.component';
import { ReceiptViewComponent } from './pages/receipt-view/receipt-view.component';

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
        path: 'new',
        component: PurchaseEditorNewComponent
      },
      {
        path: 'edit/:purchaseId',
        component: PurchaseEditorEditComponent
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
    {
      provide: HTTP_INTERCEPTORS,
      useClass: InterceptorService,
      multi: true
    }
  ]
})
export class AppRoutingModule {
}
