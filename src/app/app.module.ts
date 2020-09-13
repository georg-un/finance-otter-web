import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LayoutModule } from './layout/layout.module';
import { SummaryModule } from './pages/summary/summary.module';
import { PurchaseListModule } from './pages/purchase-list/purchase-list.module';
import { PurchaseViewModule } from './pages/purchase-view/purchase-view.module';
import { PurchaseEditorModule } from './pages/purchase-editor/purchase-editor.module';
import { AppStoreModule } from './store/app-store.module';
import { CoreModule } from './core/core.module';
import { RegisterModule } from './pages/register/register.module';
import { MAT_DATE_LOCALE, MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material';
import { MultilineSnackbarComponent } from './shared/multiline-snackbar/multiline-snackbar.component';
import { ReceiptScannerModule } from './pages/receipt-scanner/receipt-scanner.module';
import { ReceiptViewModule } from './pages/receipt-view/receipt-view.module';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { MultilineSnackbarModule } from './shared/multiline-snackbar/multiline-snackbar.module';

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
    ReceiptScannerModule,
    ReceiptViewModule,
    MultilineSnackbarModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [
    {provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: {duration: 2500}},
    {provide: MAT_DATE_LOCALE, useValue: 'en-GB'}
  ],
  entryComponents: [
    MultilineSnackbarComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
