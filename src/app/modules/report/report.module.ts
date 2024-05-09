import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportRoutingModule } from './report-routing.module';
import { ReportComponent } from './report/report.component';
import { TranslateModule } from '@ngx-translate/core';
import { RecentOrdersComponent } from './recent-orders/recent-orders.component';
import { SharedModule } from '../../shared/shared.module';
import { TopOrderersComponent } from './top-orderers/top-orderers.component';
import { MostOrderSendersComponent } from './most-order-senders/most-order-senders.component';
import { BestSellingProductsComponent } from './best-selling-products/best-selling-products.component';


@NgModule({
  declarations: [
    ReportComponent,
    RecentOrdersComponent,
    TopOrderersComponent,
    MostOrderSendersComponent,
    BestSellingProductsComponent
  ],
  imports: [
    CommonModule,
    ReportRoutingModule,
    TranslateModule,
    SharedModule,
  ]
})
export class ReportModule { }
