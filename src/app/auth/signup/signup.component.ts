import { Component, OnInit } from '@angular/core';
import {NgForm} from "@angular/forms";
import {UserService} from "../../services/user.service";

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  loading: boolean=false;

  constructor(private userService:UserService) { }

  ngOnInit(): void {
  }

  onSignup(form: NgForm) {
    console.log(form);
    this.userService.signUp(form.value.email, form.value.password);
  }
}
