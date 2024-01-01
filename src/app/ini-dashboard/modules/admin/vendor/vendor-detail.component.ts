import { Component, OnInit } from '@angular/core';
import { IniDashboardService } from '@app/ini-dashboard/ini-dashboard.service';

@Component({
  selector: 'app-vendor-detail',
  templateUrl: './vendor-detail.component.html',
  // styleUrls: ['./vendor-detail.component.scss']
})
export class VendorDetailComponent implements OnInit {

  constructor(
    public dashboardService: IniDashboardService
  ) { }

  ngOnInit() {
    setTimeout(() => {
      this.dashboardService.isHome = false;
  });
  }

}
