import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LayoutModule } from './layout/layout.module';
import { SummaryModule } from './summary/summary.module';
import { PurchaseListModule } from './purchase-list/purchase-list.module';
import { PurchaseViewModule } from './purchase-view/purchase-view.module';
import { PurchaseEditorModule } from './purchase-editor/purchase-editor.module';
import { AppStoreModule } from './store/app-store.module';
import { SharedModule } from "./shared/shared.module";
import { CoreModule } from "./core/core.module";
import { RegisterModule } from "./register/register.module";

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    CoreModule,
    SharedModule,
    LayoutModule,
    SummaryModule,
    PurchaseListModule,
    PurchaseViewModule,
    PurchaseEditorModule,
    RegisterModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    AppStoreModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
