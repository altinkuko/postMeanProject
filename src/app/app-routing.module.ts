import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {PostListComponent} from "./components/post-list/post-list.component";
import {PostCreateComponent} from "./components/post-create/post-create.component";
import {AuthGuard} from "./auth/auth-guard";

const routes: Routes = [
  {path:'', component: PostListComponent},
  {path:'create-post', component:PostCreateComponent, canActivate:[AuthGuard]},
  {path:'edit-post/:id', component:PostCreateComponent, canActivate:[AuthGuard]},
  {path: 'auth', loadChildren: ()=> import('./auth/auth-routing-module').then(m => m.AuthRoutingModule)}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers:[AuthGuard]
})
export class AppRoutingModule { }
