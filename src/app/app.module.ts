import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LayoutModule } from './layout/layout.module';
import { SummaryModule } from './summary/summary.module';
import { PaymentListModule } from './payment-list/payment-list.module';
import { PaymentViewModule } from './payment-view/payment-view.module';
import { PaymentEditorModule } from './payment-editor/payment-editor.module';
import { AppStoreModule } from './store/app-store.module';
import { SharedModule } from "./shared/shared.module";

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    SharedModule,
    LayoutModule,
    SummaryModule,
    PaymentListModule,
    PaymentViewModule,
    PaymentEditorModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    AppStoreModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
