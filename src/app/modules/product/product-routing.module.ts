import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductListComponent } from './product-list/product-list.component';
import { ProductCreateComponent } from './product-create/product-create.component';
import { ProductUpdateComponent } from './product-update/product-update.component';


const routes: Routes = [
  { path: '', component: ProductListComponent, pathMatch: 'full'},
  { path: 'product-create', component: ProductCreateComponent},
  { path: 'product-update', component: ProductUpdateComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductRoutingModule { }
