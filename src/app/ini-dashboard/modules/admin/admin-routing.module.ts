import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminComponent } from './admin.component';
import { VendorListComponent } from './vendor/vendor-list.component';

const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: [
      {
        path: 'vendor',
        component: VendorListComponent
      },
      { path: '', redirectTo: 'vendor', pathMatch: 'full' }
    ]
  },
  { path: '', redirectTo: '/app/admin/vendor', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
