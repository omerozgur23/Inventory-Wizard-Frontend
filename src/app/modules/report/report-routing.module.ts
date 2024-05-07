import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReportComponent } from './report/report.component';
import { RecentOrdersComponent } from './recent-orders/recent-orders.component';
import { TopOrderersComponent } from './top-orderers/top-orderers.component';
import { MostOrderSendersComponent } from './most-order-senders/most-order-senders.component';
import { BestSellingProductsComponent } from './best-selling-products/best-selling-products.component';

const routes: Routes = [
  { path: '', component: ReportComponent, pathMatch:'full' },
  { path: 'recent-orders', component: RecentOrdersComponent },
  { path: 'top-orderers', component: TopOrderersComponent },
  { path: 'most-order-senders', component: MostOrderSendersComponent },
  { path: 'best-selling-products', component: BestSellingProductsComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportRoutingModule { }
