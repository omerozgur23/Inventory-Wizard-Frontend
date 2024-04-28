import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AccessDeniedRoutingModule } from './access-denied-routing.module';
import { AccessDeniedComponent } from './access-denied/access-denied.component';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  declarations: [
    AccessDeniedComponent
  ],
  imports: [
    CommonModule,
    AccessDeniedRoutingModule,
    TranslateModule,
  ]
})
export class AccessDeniedModule { }
