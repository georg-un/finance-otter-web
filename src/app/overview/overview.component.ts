import { Component, OnInit } from '@angular/core';
import { MockRestService } from '../core/rest-service/mock-rest.service';
import { User } from '../core/rest-service/entity/user';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit {

  users: User[];

  constructor(private mockRestService: MockRestService) {
    this.users = mockRestService.fetchUsers();
  }

  ngOnInit() {
  }

}
