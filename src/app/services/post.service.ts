import {Injectable} from '@angular/core';
import {Post} from "../components/models/post";
import {Subject} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {map} from "rxjs/operators";
import {Router} from "@angular/router";
import {isObject} from "rxjs/internal-compatibility";
import { environment} from "../../environments/environment";

const BACKEND_URL = environment.apiUrl;

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
    this.http.get<any>(BACKEND_URL + '/posts' + queryParams).pipe(map((data) => {
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
    return this.http.get<Post>(BACKEND_URL + '/post/' + id);
  }

  addPost(post: Post, image: File) {
    const postData = new FormData();
    postData.append('title', post.title);
    postData.append('content', post.content);
    postData.append('image', image, post.title);
    this.http.post(BACKEND_URL + '/posts', postData).subscribe(() => {
      this.router.navigate(["/"]);
    });
  }

  deletePost(id: string) {
    return this.http.delete(BACKEND_URL + '/posts/' + id);
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
    this.http.put(BACKEND_URL + '/post/' + id, postData).subscribe(() => {
      this.router.navigate(["/"]);
    });
  }

}
