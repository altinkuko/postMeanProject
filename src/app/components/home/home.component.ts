import { Component, OnInit } from '@angular/core';
import {Post} from "../models/post";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  posts:Post[]=new Array();

  constructor() { }

  ngOnInit(): void {
  }

  onPostAdded(post:Post){
    this.posts.push(post)
  }

}
