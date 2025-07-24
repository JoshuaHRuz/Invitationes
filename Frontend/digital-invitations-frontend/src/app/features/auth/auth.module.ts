import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthRoutingModule } from './auth-routing.module';
import { FormsModule } from '@angular/forms';
import { LoginComponent } from './login/login';

@NgModule({
  imports: [
    CommonModule,
    AuthRoutingModule,
    FormsModule,
    LoginComponent
  ],
  declarations: [

  ]
})
export class AuthModule { } 