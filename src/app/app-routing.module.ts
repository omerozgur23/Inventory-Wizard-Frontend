import { InvoiceModule } from './modules/invoice/invoice.module';
import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, RouterOutlet, Routes } from '@angular/router';
import { LoginComponent } from './core/component/login/login.component';
import { ErrorComponent } from './core/component/error/error.component';
import { MenuComponent } from './core/component/menu/menu.component';
import { loginGuard } from './core/guard/login.guard';
import { roleControlGuard } from './shared/guard/role-control.guard';
import { ROLE_ADMIN, ROLE_EMPLOYEE, ROLE_REPORTER } from './shared/model/constants';
import { ProductSaleComponent } from './modules/product/product-sale/product-sale.component';
import { OrderDetailsComponent } from './modules/order/order-details/order-details.component';
import { AccountComponent } from './core/component/account/account.component';
import { InvoiceDetailComponent } from './modules/invoice/invoice-detail/invoice-detail.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path:'home', component: MenuComponent,
   canActivate: [loginGuard],
    children: [
      { path: '', redirectTo: 'shelf', pathMatch: 'full'},
      { path: 'product', loadChildren: () => import('./modules/product/product.module').then(m => m.ProductModule)},
      { path: 'employee', loadChildren: () => import('./modules/employee/employee.module').then(m => m.EmployeeModule), canActivate: [roleControlGuard(ROLE_ADMIN)] },
      { path: 'shelf', loadChildren: () => import('./modules/warehouse/warehouse.module').then(m => m.WarehouseModule)},
      { path: 'category', loadChildren: () => import('./modules/category/category.module').then(m => m.CategoryModule)},
      { path: 'supplier', loadChildren: () => import('./modules/supplier/supplier.module').then(m => m.SupplierModule)},
      { path: 'customer', loadChildren: () => import('./modules/customer/customer.module').then(m => m.CustomerModule)},
      { path: 'order', loadChildren: () => import('./modules/order/order.module').then(m => m.OrderModule)},
      { path: 'report', loadChildren: () => import('./modules/report/report.module').then(m => m.ReportModule), canActivate: [roleControlGuard(ROLE_ADMIN, ROLE_REPORTER)] },
      { path: 'invoice', loadChildren: () => import('./modules/invoice/invoice.module').then(m => m.InvoiceModule)},
      { path: 'product-sale', component: ProductSaleComponent, canActivate: [roleControlGuard(ROLE_ADMIN, ROLE_EMPLOYEE)] },
      { path: 'order-details', component: OrderDetailsComponent },
      { path: 'invoice-details', component: InvoiceDetailComponent },
      { path: 'access-denied', loadChildren: () => import('./modules/access-denied/access-denied.module').then(m => m.AccessDeniedModule)},
      { path: 'settings', component: AccountComponent },
    ]
  },
  { path: '**', component: ErrorComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

 }
