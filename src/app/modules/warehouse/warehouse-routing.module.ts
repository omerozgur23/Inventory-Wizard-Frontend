import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ShelfListComponent } from './shelf-list/shelf-list.component';

const routes: Routes = [
  { path: '', component: ShelfListComponent, pathMatch: 'full'},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WarehouseRoutingModule { }
