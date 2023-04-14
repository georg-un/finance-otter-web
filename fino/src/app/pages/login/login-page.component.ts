import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss'],
  standalone: true,
  imports: [
    MatButtonModule
  ]
})
export class LoginPageComponent {

  constructor(public auth: AuthService) {
  }

}
