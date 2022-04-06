import { Injectable } from '@angular/core';
import { Auth, authState } from '@angular/fire/auth';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class UserGuard implements CanActivate {
  constructor(
    private auth: Auth,
    private router: Router,
    private user_service: UserService
  ) {}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    // if (!this.user_service.user$) {
    //   console.log(this.user_service.user$);
    //   return true;
    // } else {
    //   console.log(this.user_service.user$);
    //   return false;
    // }
    const isLoggedIn = authState(this.auth).subscribe((isLoggedIn) => {
      if (isLoggedIn) {
        return false;
      } else {
        return true;
      }
    });

    if (!isLoggedIn) {
      console.log(this.user_service.user$);
      return true;
    } else {
      console.log(this.user_service.user$);
      return false;
    }
  }
}
