import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { reducers, metaReducers } from './index';
import { environment } from '../../environments/environment';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { EffectsModule } from '@ngrx/effects';
import { NavigationActionTiming, StoreRouterConnectingModule } from '@ngrx/router-store';
import { StoreModule } from '@ngrx/store';
import { PurchaseEffects } from './effects/purchase.effects';
import { UserEffects } from './effects/user.effects';
import { SummaryEffects } from "./effects/summary.effects";

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    StoreModule.forRoot(
      reducers,
      {
      metaReducers,
      runtimeChecks: {
        strictStateImmutability: true,
        strictActionImmutability: true,
      }
    }),
    StoreRouterConnectingModule.forRoot({navigationActionTiming: NavigationActionTiming.PostActivation}),
    !environment.production ? StoreDevtoolsModule.instrument() : [],
    EffectsModule.forRoot([PurchaseEffects, UserEffects, SummaryEffects]),
    StoreRouterConnectingModule.forRoot(),
  ]
})
export class AppStoreModule { }
