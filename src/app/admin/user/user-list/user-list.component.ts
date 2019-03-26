import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';

@Component({
  selector: 'rvw-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {
  users: any[];

  constructor(private userService: UserService) { }

  ngOnInit() {
    this.userService.getUsers().subscribe(u => this.users = u);
  }

  /*
  URLS

    POST - https://c4vxp6b5m3.execute-api.eu-central-1.amazonaws.com/dev/
  GET - https://c4vxp6b5m3.execute-api.eu-central-1.amazonaws.com/dev/
  GET - https://c4vxp6b5m3.execute-api.eu-central-1.amazonaws.com/dev/{id}
  PUT - https://c4vxp6b5m3.execute-api.eu-central-1.amazonaws.com/dev/{id}
  DELETE - https://c4vxp6b5m3.execute-api.eu-central-1.amazonaws.com/dev/{id}

  */
}
