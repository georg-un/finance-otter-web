import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { reducers, metaReducers } from "./index";
import { environment } from "../../environments/environment";
import { StoreDevtoolsModule } from "@ngrx/store-devtools";
import { EffectsModule } from "@ngrx/effects";
import { StoreRouterConnectingModule } from '@ngrx/router-store';
import { StoreModule } from "@ngrx/store";
import { PaymentEffects } from "./effects/payment.effects";
import { UserEffects } from "./effects/user.effects";

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
    !environment.production ? StoreDevtoolsModule.instrument() : [],
    EffectsModule.forRoot([PaymentEffects, UserEffects]),
    StoreRouterConnectingModule.forRoot(),
  ]
})
export class AppStoreModule { }
