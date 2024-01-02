import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminComponent } from './admin.component';
import { SharedModule } from '@app/_shared/shared.module';
import { AdminRoutingModule } from './admin-routing.module';
import { VendorListComponent } from './vendor/vendor-list.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    AdminRoutingModule
  ],
  declarations: [
    AdminComponent,
    VendorListComponent,
  ]
})
export class AdminModule { }
