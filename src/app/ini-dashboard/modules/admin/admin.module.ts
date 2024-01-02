import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminComponent } from './admin.component';
import { SharedModule } from '@app/_shared/shared.module';
import { AdminRoutingModule } from './admin-routing.module';
import { VendorListComponent } from './vendor/vendor-list.component';
import { VendorDetailComponent } from './vendor/vendor-detail.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    AdminRoutingModule
  ],
  declarations: [
    AdminComponent,
    VendorListComponent,
    VendorDetailComponent,
  ]
})
export class AdminModule { }
