import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {Subject} from "rxjs";
import {unwrapConstructorDependencies} from "@angular/compiler-cli/src/ngtsc/annotations/src/util";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private isLogged = false;
  private authStatus = new Subject<boolean>();
  private tokenTimer: any;

  constructor(private http: HttpClient, private router: Router) {
  }

  signUp(email: string, password: string) {
    const userData = {
      email: email,
      password: password
    }
    this.http.post("http://localhost:3000/api/user/signup", userData).subscribe(data => {
      console.log(data);
      this.router.navigate([''])
    }, error => {console.log(error)}
    )
  }

  login(email: string, password: string) {
    const userData = {
      email: email,
      password: password
    }
    this.http.post<{ token: string, expiresIn: number, userId:string }>("http://localhost:3000/api/user/login", userData).subscribe(data => {
      const token = data.token;
      if (token) {
        const expiresIn = data.expiresIn;
        this.tokenTimer = setTimeout(() => {
          this.logOut()
        }, expiresIn * 1000)
        this.isLogged = true;
        this.authStatus.next(true);
        const now = new Date();
        const expiration = new Date(now.getTime() + expiresIn * 1000);
        this.saveToken(token, expiration, data.userId)
        this.router.navigate(['']);
      }
    }, error => {console.log(error)}
    )
  }


  isLoggedIn() {
    return this.authStatus.asObservable();
  }

  logOut() {
    this.isLogged = false;
    this.authStatus.next(false);
    clearTimeout(this.tokenTimer)
    this.clearToken();
    this.router.navigate([''])
  }


  getLoggedIn() {
    const authData = this.getAuthData();
    if (authData !== null) {
      const now = new Date();
      const expiresIn = authData.expirationDate.getTime() - now.getTime();
      if (expiresIn > 0) {
        this.isLogged = true;
      } else {
        this.clearToken();
        this.isLogged = false;
      }
    }
    return this.isLogged;
  }

  private saveToken(token: string, expiresDate: Date, userId:string) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expiresDate.toISOString());
    localStorage.setItem('userId', userId);
  }

  private clearToken() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
    localStorage.removeItem('userId')
  }

  private getAuthData() {
    const token = localStorage.getItem('token');
    const expiresIn = localStorage.getItem('expiration');
    if (!token || !expiresIn) {
      return null;
    }
    return {
      token: token,
      expirationDate: new Date(expiresIn),
      userId: localStorage.getItem('userId')
    }
  }

}
