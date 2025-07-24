import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LandingRoutingModule } from './landing-routing.module';
import { LandingComponent } from './landing/landing';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';

@NgModule({
imports: [
    CommonModule,
    LandingRoutingModule,
    MatButtonModule,
    MatToolbarModule,
    LandingComponent
  ],
  declarations: [
  ]
})
export class LandingModule { } 