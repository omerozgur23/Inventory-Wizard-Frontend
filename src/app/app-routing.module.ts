import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './core/component/login/login.component';
import { ErrorComponent } from './core/component/error/error.component';
import { MenuComponent } from './core/component/menu/menu.component';
import { loginGuard } from './core/guard/login.guard';
import { roleControlGuard } from './shared/guard/role-control.guard';
import { ROLE_ADMIN, ROLE_EMPLOYEE } from './shared/model/constants';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path:'menu', component: MenuComponent, //  canActivate: [loginGuard], 
    children: [
      { path: 'product-list', loadChildren: () => import('./modules/product/product.module').then(m => m.ProductModule) },
      { path: 'employee-list', loadChildren: () => import('./modules/employee/employee.module').then(m => m.EmployeeModule)},
      { path: 'shelf-list', loadChildren: () => import('./modules/warehouse/warehouse.module').then(m => m.WarehouseModule)},
    ]
  },
  

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
