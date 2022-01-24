import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from "@angular/router";
import {Observable} from "rxjs";
import {UserService} from "../services/user.service";
import {Injectable} from "@angular/core";

@Injectable()
export class AuthGuard implements CanActivate{
  constructor(private userService:UserService, private router:Router) {
  }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const isAuth = this.userService.getLoggedIn();
    if (!isAuth){
      this.router.navigate(['/login']);
    }
    return isAuth;
  }
}
