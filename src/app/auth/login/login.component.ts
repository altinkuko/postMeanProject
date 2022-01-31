import { Component, OnInit } from '@angular/core';
import {NgForm} from "@angular/forms";
import {UserService} from "../../services/user.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loading: boolean = false;
  rememberMe:boolean = false;

  constructor(private userService:UserService, private router: Router) { }

  ngOnInit(): void {
    if (this.userService.getLoggedIn()){
      this.router.navigate(['']);
    }
  }

  onLogin(loginForm: NgForm) {
    console.log(this.rememberMe)
    this.userService.login(loginForm.value.email, loginForm.value.password, this.rememberMe);
  }

  remember(){
    this.rememberMe = !this.rememberMe;
  }
}
