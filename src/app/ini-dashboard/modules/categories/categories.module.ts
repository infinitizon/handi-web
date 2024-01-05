import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoriesComponent } from './categories.component';
import { SharedModule } from '@app/_shared/shared.module';
import { CategoriesListComponent } from './view/categories-list/categories-list.component';
import { CategoriesRoutingModule } from './categories-routing.module';
import { AddCategoryComponent } from './dialog/add-category/add-category.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    CategoriesRoutingModule
  ],
  declarations: [
    CategoriesComponent,
    CategoriesListComponent,
    AddCategoryComponent
  ]
})
export class CategoriesModule { }
