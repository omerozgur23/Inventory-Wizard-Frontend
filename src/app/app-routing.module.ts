import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, RouterOutlet, Routes } from '@angular/router';
import { LoginComponent } from './core/component/login/login.component';
import { ErrorComponent } from './core/component/error/error.component';
import { MenuComponent } from './core/component/menu/menu.component';
import { loginGuard } from './core/guard/login.guard';
import { roleControlGuard } from './shared/guard/role-control.guard';
import { ROLE_ADMIN, ROLE_EMPLOYEE } from './shared/model/constants';
import { ProductSaleComponent } from './modules/product/product-sale/product-sale.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path:'menu', component: MenuComponent, 
  //  canActivate: [loginGuard], 
    children: [
      { path: 'product', loadChildren: () => import('./modules/product/product.module').then(m => m.ProductModule)},
      { path: 'employee', loadChildren: () => import('./modules/employee/employee.module').then(m => m.EmployeeModule)},
      { path: 'shelf', loadChildren: () => import('./modules/warehouse/warehouse.module').then(m => m.WarehouseModule)},
      { path: 'category', loadChildren: () => import('./modules/category/category.module').then(m => m.CategoryModule)},
      { path: 'supplier', loadChildren: () => import('./modules/supplier/supplier.module').then(m => m.SupplierModule)},
      { path: 'customer', loadChildren: () => import('./modules/customer/customer.module').then(m => m.CustomerModule)},
      { path: 'order', loadChildren: () => import('./modules/order/order.module').then(m => m.OrderModule)},
      { path: 'report', loadChildren: () => import('./modules/report/report.module').then(m => m.ReportModule)},
      { path: 'product-sale', component: ProductSaleComponent },

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
