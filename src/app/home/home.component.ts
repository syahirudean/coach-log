import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../user/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  constructor(private router: Router, public user_service: UserService) {}

  // login() {
  //   this.router.navigate(['/user']);
  // }

  console(user: any) {
    console.log(user);
  }
}
