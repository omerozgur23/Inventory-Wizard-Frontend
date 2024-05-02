import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReportComponent } from './report/report.component';
import { RecentOrdersComponent } from './recent-orders/recent-orders.component';

const routes: Routes = [
  { path: '', component: ReportComponent, pathMatch:'full' },
  { path: 'recent-orders', component: RecentOrdersComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportRoutingModule { }
