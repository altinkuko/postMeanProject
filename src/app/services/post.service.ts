import {Injectable} from '@angular/core';
import {Post} from "../components/models/post";
import {Subject} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {map} from "rxjs/operators";
import {Router} from "@angular/router";
import {isObject} from "rxjs/internal-compatibility";
import {request} from "express";

@Injectable({
  providedIn: 'root'
})
export class PostService {

  private posts: Post[] = []
  private postUpdate = new Subject<{ posts: Post[], count: number }>()


  constructor(private http: HttpClient, private router: Router) {
  }

  getPosts(pageSize: number, currentPage: number) {
    const queryParams = `?pageSize=${pageSize}&page=${currentPage}`
    this.http.get<any>('http://localhost:3000/api/posts' + queryParams).pipe(map((data) => {
      return {
        posts: data.posts.map(post => {
          return {
            title: post.title,
            content: post.content,
            id: post._id,
            imagePath: post.imagePath,
            creator: post.creator
          }
        }), maxCount: data.maxCount
      }
    })).subscribe((data) => {
      this.posts = data.posts;
      this.postUpdate.next({posts: [...this.posts], count: data.maxCount})
    });
  }

  getUpdatedPosts() {
    return this.postUpdate.asObservable();
  }

  getPost(id: string) {
    return this.http.get<Post>('http://localhost:3000/api/post/' + id);
  }

  addPost(post: Post, image: File) {
    const postData = new FormData();
    postData.append('title', post.title);
    postData.append('content', post.content);
    postData.append('image', image, post.title);
    this.http.post('http://localhost:3000/api/posts', postData).subscribe(() => {
      this.router.navigate(["/"]);
    });
  }

  deletePost(id: string) {
    return this.http.delete('http://localhost:3000/api/posts/' + id);
  }

  editPost(post: Post, id: string, image: File | string) {
    let postData: Post | FormData;
    if (isObject(image)) {
      postData = new FormData();
      postData.append('title', post.title);
      postData.append('content', post.content);
      postData.append('image', image, post.title);
    } else {
      postData = {
        id:id,
        title: post.title,
        content: post.content,
        imagePath: image
      };
    }
    this.http.put('http://localhost:3000/api/post/' + id, postData).subscribe(() => {
      this.router.navigate(["/"]);
    });
  }

}
