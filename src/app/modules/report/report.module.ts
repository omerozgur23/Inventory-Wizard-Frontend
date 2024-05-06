import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportRoutingModule } from './report-routing.module';
import { ReportComponent } from './report/report.component';
import { TranslateModule } from '@ngx-translate/core';
import { RecentOrdersComponent } from './recent-orders/recent-orders.component';
import { SharedModule } from '../../shared/shared.module';


@NgModule({
  declarations: [
    ReportComponent,
    RecentOrdersComponent
  ],
  imports: [
    CommonModule,
    ReportRoutingModule,
    TranslateModule,
    SharedModule,
  ]
})
export class ReportModule { }
