import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: 'admin',
    // component: OffersComponent,
    children: [
        {
          path: 'my-portfolio-distribution/:id',
          // component: MyPortfolioDistributionComponent
        },
        {
          path: 'offers-detail/:id',
          // component: OffersDetailComponent
        },
        {
          path: 'vendor',
          // component: GatewayPaymentComponent
        }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
