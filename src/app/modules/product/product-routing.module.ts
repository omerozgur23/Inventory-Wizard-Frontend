import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductListComponent } from './product-list/product-list.component';
import { ProductCreateComponent } from './product-create/product-create.component';
import { ProductUpdateComponent } from './product-update/product-update.component';
import { ProductSaleComponent } from './product-sale/product-sale.component';


const routes: Routes = [
  { path: '', component: ProductListComponent, pathMatch: 'full'},
  { path: 'create', component: ProductCreateComponent},
  { path: 'update', component: ProductUpdateComponent},
  { path: 'sale', component: ProductSaleComponent, pathMatch:'full'},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductRoutingModule { }
