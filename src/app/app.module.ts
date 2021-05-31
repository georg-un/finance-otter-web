import { BrowserModule } from '@angular/platform-browser';
import { LOCALE_ID, NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LayoutModule } from './layout/layout.module';
import { SummaryModule } from './pages/summary/summary.module';
import { PurchaseListModule } from './pages/purchase-list/purchase-list.module';
import { PurchaseViewModule } from './pages/purchase-view/purchase-view.module';
import { PurchaseEditorModule } from './pages/payment-editor/purchase-editor.module';
import { AppStoreModule } from './store/app-store.module';
import { CoreModule } from './core/core.module';
import { RegisterModule } from './pages/register/register.module';
import { MultilineSnackbarComponent } from './shared/multiline-snackbar/multiline-snackbar.component';
import { ReceiptProcessorModule } from './pages/receipt-processor/receipt-processor.module';
import { ReceiptViewModule } from './pages/receipt-view/receipt-view.module';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { MultilineSnackbarModule } from './shared/multiline-snackbar/multiline-snackbar.module';
import { MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import localeDe from '@angular/common/locales/de';
import { registerLocaleData } from '@angular/common';

registerLocaleData(localeDe, 'de-AT');

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    CoreModule,
    LayoutModule,
    SummaryModule,
    PurchaseListModule,
    PurchaseViewModule,
    PurchaseEditorModule,
    RegisterModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    AppStoreModule,
    ReceiptProcessorModule,
    ReceiptViewModule,
    MultilineSnackbarModule,
    ServiceWorkerModule.register('ngsw-worker.js', {enabled: environment.production}),
    MatCardModule
  ],
  providers: [
    {provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: {duration: 2500}},
    {provide: LOCALE_ID, useValue: 'de-AT'}
  ],
  entryComponents: [
    MultilineSnackbarComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
