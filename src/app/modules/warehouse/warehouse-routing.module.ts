import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ShelfListComponent } from './shelf-list/shelf-list.component';
import { ShelfCreateComponent } from './shelf-create/shelf-create.component';
import { AcceptProductComponent } from './accept-product/accept-product/accept-product.component';

const routes: Routes = [
  { path: '', component: ShelfListComponent, pathMatch: 'full'},
  { path: 'shelf-create', component: ShelfCreateComponent, },
  { path: 'accept-product', component: AcceptProductComponent, },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WarehouseRoutingModule { }
