import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrderListComponent } from './order-list/order-list.component';
import { OrderDetailsComponent } from './order-details/order-details.component';
import { InvoiceCreateComponent } from '../invoice/invoice-create/invoice-create.component';

const routes: Routes = [
  {path: '', component: OrderListComponent, pathMatch:'full'},
  {path: 'order-details', component: OrderDetailsComponent},
  {path: 'invoice', component: InvoiceCreateComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrderRoutingModule { }
