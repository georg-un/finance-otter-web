import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NgxsModule} from '@ngxs/store';
import {NgxsReduxDevtoolsPluginModule} from '@ngxs/devtools-plugin';
import {CategoryState} from './category/category.state';
import {PurchaseState} from './purchase/purchase.state';
import {SummaryState} from './summary/summary.state';
import {UserState} from './user/user.state';
import {environment} from '../../environments/environment';


@NgModule({
  imports: [
    CommonModule,
    NgxsModule.forRoot([
      CategoryState,
      PurchaseState,
      SummaryState,
      UserState
    ]),
    NgxsReduxDevtoolsPluginModule.forRoot({
      disabled: environment.production
    })
  ]
})
export class StoreModule {
}
