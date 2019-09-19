import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TransactionCardComponent } from './transaction-card/transaction-card.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {
  MatButtonModule,
  MatCardModule, MatCheckboxModule, MatDatepickerModule,
  MatIconModule, MatInputModule,
  MatListModule, MatMenuModule, MatNativeDateModule, MatSelectModule,
  MatSidenavModule, MatSlideToggleModule,
  MatToolbarModule
} from '@angular/material';
import { SidenavComponent } from './layout/sidenav/sidenav.component';
import { HeaderComponent } from './layout/header/header.component';
import { TransactionsComponent } from './transactions/transactions.component';
import { UserCardComponent } from './user-card/user-card.component';
import { OverviewComponent } from './overview/overview.component';
import { PaymentViewComponent } from './payment-view/payment-view.component';
import { DebitCardComponent } from './debit-card/debit-card.component';
import { PaymentEditorComponent } from './payment-editor/payment-editor.component';
import { LayoutComponent } from './layout/layout.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    TransactionCardComponent,
    SidenavComponent,
    HeaderComponent,
    TransactionsComponent,
    UserCardComponent,
    OverviewComponent,
    PaymentViewComponent,
    DebitCardComponent,
    PaymentEditorComponent,
    LayoutComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatCardModule,
    MatButtonModule,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatListModule,
    MatSelectModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCheckboxModule,
    MatSlideToggleModule,
    FormsModule,
    MatMenuModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
