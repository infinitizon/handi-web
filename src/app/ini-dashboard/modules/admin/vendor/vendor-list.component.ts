import { Component, OnInit } from '@angular/core';
import { IniDashboardService } from '@app/ini-dashboard/ini-dashboard.service';

@Component({
  selector: 'app-vendor-list',
  templateUrl: './vendor-list.component.html',
  // styleUrls: ['./vendor-list.component.scss']
})
export class VendorListComponent implements OnInit {

  constructor(
    public dashboardService: IniDashboardService
  ) { }

  ngOnInit() {
    setTimeout(() => {
      this.dashboardService.isHome = false;
  });
  }

}
