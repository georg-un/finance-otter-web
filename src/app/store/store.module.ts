import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {NgxsModule} from '@ngxs/store';
import {CategoryState} from './category/category.state';
import {PurchaseState} from './purchase/purchase.state';
import {SummaryState} from './summary/summary.state';
import {UserState} from './user/user.state';


@NgModule({
  imports: [
    CommonModule,
    NgxsModule.forRoot([
      CategoryState,
      PurchaseState,
      SummaryState,
      UserState
    ])
  ]
})
export class StoreModule { }
