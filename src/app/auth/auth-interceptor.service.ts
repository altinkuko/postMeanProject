import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {Observable} from "rxjs";
import {UserService} from "../services/user.service";

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {

  constructor(private userService:UserService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (this.userService.getLoggedIn()) {
      const newReq = req.clone({
        headers: req.headers.set("Authorization", "Bearer " + localStorage.getItem("token"))
      });
      return next.handle(newReq);
    } else {
      return next.handle(req);
    }
  }
}
