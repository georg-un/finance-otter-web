import {environment} from '../../../environments/environment';
import {AuthService} from '@auth0/auth0-angular';
import {DemoAuthService} from './demo-auth.service';
import {FinOBackendService} from '../fino-backend.service';
import {DemoBackendService} from './demo-backend.service';

export const CONDITIONAL_DEMO_PROVIDERS = environment.demo ?
  [
    {provide: AuthService, useClass: DemoAuthService},
    {provide: FinOBackendService, useClass: DemoBackendService}
  ] :
  [];
