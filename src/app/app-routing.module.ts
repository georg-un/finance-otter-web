import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PaymentListComponent } from './payment-list/payment-list.component';
import { SummaryComponent } from './summary/summary.component';
import { PaymentViewComponent } from './payment-view/payment-view.component';
import { LayoutComponent } from './layout/layout.component';
import { PaymentEditorNewComponent } from './payment-editor/payment-editor-new.component';
import { PaymentEditorEditComponent } from './payment-editor/payment-editor-edit.component';
import { AuthGuard } from './auth.guard';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { InterceptorService } from './core/interceptor.service';

const routes: Routes = [
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
        component: PaymentListComponent,
        data: {animation: 'Overview'}
      },
      {
        path: 'summary',
        component: SummaryComponent,
        data: {animation: 'Summary'}
      },
      {
        path: 'payment/:paymentId',
        component: PaymentViewComponent,
        data: {animation: 'PaymentView'}
      },
      {
        path: 'new',
        component: PaymentEditorNewComponent,
        data: {animation: 'Editor'}
      },
      {
        path: 'edit/:paymentId',
        component: PaymentEditorEditComponent,
        data: {animation: 'Editor'}
      }
    ]
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
export class AppRoutingModule { }
