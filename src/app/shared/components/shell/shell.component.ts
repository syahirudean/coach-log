import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/user/user.service';

@Component({
  selector: 'app-shell',
  templateUrl: './shell.component.html',
  styleUrls: ['./shell.component.scss'],
})
export class ShellComponent {
  constructor(private router: Router, public user_service: UserService) {}

  home() {
    const user = this.user_service.uid;
    if (user) {
      this.router.navigate([user]);
    } else {
      this.router.navigate(['/']);
    }
  }
}
