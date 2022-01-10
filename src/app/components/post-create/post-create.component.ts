import {Component, OnInit} from '@angular/core';
import {Post} from "../models/post";
import {PostService} from "../../services/post.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {mimeType} from "./mime-type.validators";

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {
  post: Post;
  private editing:boolean;
  private postId: string;
  loading = false;
  postForm : FormGroup;
  imageUrl: string;

  constructor(private postService:PostService, public route:ActivatedRoute, private router:Router) { }

  ngOnInit(): void {
    this.postForm=new FormGroup({
      title:new FormControl(
        null, {validators:[Validators.required, Validators.minLength(3)]}),
      content:new FormControl(
        null, {validators:[Validators.required]}
      ),
      image:new FormControl(null,{validators:[Validators.required], asyncValidators:[mimeType]})
    });
    this.route.paramMap.subscribe((param)=>{
      if (param.has('id')){
        this.editing=true;
        this.loading=true;
        this.postId=param.get('id');
        this.postService.getPost(this.postId).subscribe(post=>{
          this.loading=false;
          this.post=post;
          this.postForm.setValue({
            title: post.title,
            content: post.content,
            image: this.post.imagePath
          });
          this.imageUrl = this.post.imagePath
        });
      }
      else {
        this.editing=false;
        this.postId=null;
      }
    });
  }

  onSave() {
    this.post={
      id:this.postId,
      title:this.postForm.value.title,
      content:this.postForm.value.content,
      imagePath:null
    };
    if (this.editing){
      this.postService.editPost(this.post, this.post.id, this.postForm.value.image);
    } else {
      this.postService.addPost(this.post, this.postForm.value.image);
    }
  }

  onImagePicked(event: Event) {
    const file= (event.target as HTMLInputElement).files[0];
      this.postForm.patchValue({image: file});
      this.postForm.get('image').updateValueAndValidity();
      const reader = new FileReader();
      reader.onload = () =>{
        this.imageUrl = reader.result.toString();
      };
      reader.readAsDataURL(file);
      }
}
