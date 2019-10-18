import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { reducers, metaReducers } from "./reducers";
import { environment } from "../../environments/environment";
import { StoreDevtoolsModule } from "@ngrx/store-devtools";
import { EffectsModule } from "@ngrx/effects";
import { CoreEffects } from "./effects/app.effects";
import { StoreRouterConnectingModule } from '@ngrx/router-store';
import { StoreModule } from "@ngrx/store";

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
    EffectsModule.forRoot([CoreEffects]),
    StoreRouterConnectingModule.forRoot(),
  ]
})
export class AppStoreModule { }
