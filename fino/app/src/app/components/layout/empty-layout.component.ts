import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-empty-layout',
  template: `
    <main>
      <router-outlet/>
    </main>
  `,
  styleUrls: ['./empty-layout.component.scss'],
  standalone: true,
  imports: [RouterModule],
})
export class EmptyLayoutComponent {
}
