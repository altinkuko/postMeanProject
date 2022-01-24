import {Component, OnDestroy, OnInit} from '@angular/core';
import {UserService} from "../../services/user.service";
import {Router} from "express";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  isLoggedIn = false;
  private authListener: Subscription;

  constructor(private userService:UserService) { }

  ngOnInit(): void {
    this.isLoggedIn = this.userService.getLoggedIn();
    this.authListener= this.userService.isLoggedIn().subscribe(authStatus=>{
      this.isLoggedIn = authStatus;
    })
  }


  logOut(){
    this.userService.logOut();
  }

  ngOnDestroy(): void {
    this.authListener.unsubscribe();
  }
}
