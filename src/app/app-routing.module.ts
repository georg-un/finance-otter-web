import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {TransactionsComponent} from "./transactions/transactions.component";
import {OverviewComponent} from "./overview/overview.component";

const routes: Routes = [
  {
    path: 'transactions',
    component: TransactionsComponent
  },
  {
    path: 'overview',
    component: OverviewComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
