import { Component, Input, OnInit } from '@angular/core';
import { User } from '../../rest-service/entity/user';

@Component({
  selector: 'app-user-card',
  templateUrl: './user-card.component.html',
  styleUrls: ['./user-card.component.scss']
})
export class UserCardComponent implements OnInit {

  @Input() user: User;
  avatar: any = 'assets/otter-avatar.jpg';

  constructor() { }

  ngOnInit() {
  }

  shortenName(firstName: string, lastName: string): string {
    return firstName.concat(' ', lastName.charAt(0), '.');
  }

}
