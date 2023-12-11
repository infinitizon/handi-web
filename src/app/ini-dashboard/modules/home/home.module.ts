import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { SharedModule } from '@app/shared/shared.module';
import { ViewHomeComponent } from './view/view-home/view-home.component';
import { HomeRoutingModule } from './home-routing.module';
import { ViewCategoriesComponent } from './view/view-categories/view-categories.component';
import { ViewSubCategoriesComponent } from './view/view-sub-categories/view-sub-categories.component';
import { ViewProvidersComponent } from './view/view-providers/view-providers.component';

@NgModule({
  imports: [
    CommonModule,
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
