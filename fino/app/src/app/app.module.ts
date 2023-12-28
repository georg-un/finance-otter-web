import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { environment } from '../environments/environment';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFirePerformanceModule } from '@angular/fire/compat/performance';
import { LoginPageComponent } from './pages/login/login-page.component';
import { ToolbarLayoutComponent } from './components/layout/toolbar-layout.component';
import { PurchaseListPageComponent } from './pages/purchase-list/purchase-list-page.component';
import { PurchaseViewComponent } from './pages/payment-view/purchase-view.component';
import { PurchaseEditorEditComponent } from './pages/payment-editor/purchase-editor-edit.component';
import { PurchaseEditorNewComponent } from './pages/payment-editor/purchase-editor-new.component';
import { HttpClientModule } from '@angular/common/http';

const PAGES = [
  ToolbarLayoutComponent,
  LoginPageComponent,
  PurchaseListPageComponent,
  PurchaseEditorNewComponent,
  PurchaseEditorEditComponent,
  PurchaseViewComponent,
]

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFirestoreModule,
    AngularFireStorageModule,
    AngularFirePerformanceModule,
    ...PAGES,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
