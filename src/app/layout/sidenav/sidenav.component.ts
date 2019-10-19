import { Component, OnInit, ViewChild } from '@angular/core';
import { SidenavService } from './sidenav.service';
import { MatSidenav } from '@angular/material';
import { User } from '../../core/rest-service/entity/user';
import { MockRestService } from '../../core/rest-service/mock-rest.service';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit {

  @ViewChild('sidenav') public sidenav: MatSidenav;
  private user: User;
  avatar: any = 'assets/otter-avatar.jpg';

  constructor(private sidenavService: SidenavService,
              private mockRestService: MockRestService
  ) { }

  ngOnInit() {
    this.mockRestService.fetchCurrentUser().subscribe(user => {
      this.user = user;
    });
    this.sidenavService.setSidenav(this.sidenav);
  }

}
