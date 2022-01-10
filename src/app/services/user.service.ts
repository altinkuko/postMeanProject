import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  signUp(email:string, password:string){
    const userData = {
      email:email,
      password:password
    }
    this.http.post("http://localhost:3000/api/user/signup", userData).subscribe(data=>{
      console.log(data)
    })
  }

  login(email:string, password:string){
    const userData = {
      email:email,
      password:password
    }
    this.http.post("http://localhost:3000/api/user/login", userData).subscribe(data=>{
      console.log(data);
    })
  }

}
