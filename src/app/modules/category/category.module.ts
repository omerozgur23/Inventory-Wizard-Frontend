import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CategoryRoutingModule } from './category-routing.module';
import { CategoryCreateComponent } from './category-create/category-create.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CategoryListComponent } from './category-list/category-list.component';


@NgModule({
  declarations: [
    CategoryCreateComponent,
    CategoryListComponent
  ],
  imports: [
    CommonModule,
    CategoryRoutingModule,
    ReactiveFormsModule
  ]
})
export class CategoryModule { }
