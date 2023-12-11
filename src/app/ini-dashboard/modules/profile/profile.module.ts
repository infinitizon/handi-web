import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileComponent } from './profile.component';
import { SharedModule } from '@app/shared/shared.module';
import { ProfileRoutingModule } from './profile-routing.module';
import { ProfileContainerComponent } from './profile-container/profile-container.component';
import { PersonalInfoComponent } from './profile-container/personal-info/personal-info.component';
import { SecurityComponent } from './profile-container/security/security.component';
import { MyOrdersComponent } from './profile-container/my-orders/my-orders.component';
import { ReferralsComponent } from './profile-container/referrals/referrals.component';
import { AddressesComponent } from './profile-container/addresses/addresses.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    ProfileRoutingModule

  ],
  declarations: [
    ProfileComponent,
    ProfileContainerComponent,
    PersonalInfoComponent,
    SecurityComponent,
    MyOrdersComponent,
    ReferralsComponent,
    AddressesComponent
  ]
})
export class ProfileModule { }
