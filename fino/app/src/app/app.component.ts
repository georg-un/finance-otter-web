import { Component } from '@angular/core';
import { UserService } from './services/user.service';
import { CategoryService } from './services/category.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'fino';

  constructor(private userService: UserService, private categoryService: CategoryService) {
  }

}
