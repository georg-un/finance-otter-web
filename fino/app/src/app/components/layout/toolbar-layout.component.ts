import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-toolbar-layout',
  templateUrl: './toolbar-layout.component.html',
  styleUrls: ['./toolbar-layout.component.scss'],
  standalone: true,
  imports: [
    RouterModule,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
  ],
})
export class ToolbarLayoutComponent {
}
