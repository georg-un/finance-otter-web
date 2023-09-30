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
import { LayoutComponent } from './components/layout/layout.component';
import { PurchaseListPageComponent } from './pages/purchase-list/purchase-list-page.component';

const PAGES = [
  LayoutComponent,
  LoginPageComponent,
  PurchaseListPageComponent,
]

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
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
