import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { GoogleMapsModule } from '@angular/google-maps'

import { SharedModule } from '@app/_shared/shared.module';
import { ViewHomeComponent } from './view/view-home/view-home.component';
import { HomeRoutingModule } from './home-routing.module';
import { ViewCategoriesComponent } from './view/view-categories/view-categories.component';
import { ViewSubCategoriesComponent } from './view/view-sub-categories/view-sub-categories.component';
import { ViewProvidersComponent } from './view/view-providers/view-providers.component';

@NgModule({
  imports: [
    CommonModule,
    GoogleMapsModule,
    SharedModule,
    HomeRoutingModule
  ],
  declarations: [
    HomeComponent,
    ViewHomeComponent,
    ViewCategoriesComponent,
    ViewSubCategoriesComponent,
    ViewProvidersComponent
  ]
})
export class HomeModule { }
