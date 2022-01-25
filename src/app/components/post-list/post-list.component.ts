import {Component, OnDestroy, OnInit} from '@angular/core';
import {Post} from "../models/post";
import {PostService} from "../../services/post.service";
import {Subscription} from "rxjs";
import {PageEvent} from "@angular/material/paginator";
import {UserService} from "../../services/user.service";

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {
  posts: Post[] = [];
  private postSub: Subscription = new Subscription();
  loading: boolean = false;
  public totalPosts = 0;
  pageSize = 5;
  pageSizeOptions = [1, 2, 5, 10];
  currentPage = 1;
  private authStatusSub: Subscription;
  isLoggedIn = false;
  userId:string = localStorage.getItem('userId');

  constructor(private postService: PostService, private userService: UserService) {
  }

  ngOnInit(): void {
    this.loading = true;
    this.postService.getPosts(this.pageSize, this.currentPage);
    this.postSub = this.postService.getUpdatedPosts().subscribe(data => {
      this.loading = false;
      this.totalPosts = data.count;
      this.posts = data.posts;
    });
    this.isLoggedIn = this.userService.getLoggedIn();
    this.authStatusSub = this.userService.isLoggedIn().subscribe(authStatus => {
      this.isLoggedIn = authStatus;
    });
  }

  ngOnDestroy(): void {
    this.postSub.unsubscribe();
    this.authStatusSub.unsubscribe();
  }

  deletePost(id: string) {
    this.loading = true;
    this.postService.deletePost(id).subscribe(() => {
      this.postService.getPosts(this.pageSize, this.currentPage);
    });
  }

  onChangePage($event: PageEvent) {
    this.loading = true;
    this.currentPage = $event.pageIndex + 1;
    this.pageSize = $event.pageSize;
    this.postService.getPosts(this.pageSize, this.currentPage);
  }

  isCreator(userId:string){
    return userId === this.userId;
  }
}
