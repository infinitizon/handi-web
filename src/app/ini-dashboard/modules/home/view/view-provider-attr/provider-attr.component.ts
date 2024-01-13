import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IniDashboardService } from '@app/ini-dashboard/ini-dashboard.service';
import { environment } from '@environments/environment';

@Component({
  selector: 'app-view-provider-attr',
  templateUrl: './provider-attr.component.html',
  styleUrls: ['./provider-attr.component.scss']
})
export class ViewProviderAttrComponent implements OnInit {

  container: any = {
    providersLoading: true
  };
  providerXterData: any;
  providerId: any;
  subCategoryId: any;
  constructor(
    public dashboardService: IniDashboardService,
    private http: HttpClient,
    private aRoute: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.aRoute.paramMap.subscribe(paramMap => {
      this.providerId = paramMap.get('id');
      this.subCategoryId = paramMap.get('subCategoryId');
      this.getProviderXteristics();
    })
  }


  getProviderXteristics() {
   let coords: any = localStorage.getItem('coords');
   const coord = JSON.parse(coords);
    this.container['providersLoading'] = true;
    this.http
      .get(`${environment.baseApiUrl}/products/tenant/${this.providerId}/${this.subCategoryId}/characteristics`)
      .subscribe(
        (response: any) => {
          this.providerXterData = response.data;
          console.log(this.providerXterData);

          this.container['providersLoading'] = false; },
        (errResp) => {
          this.container['providersLoading'] = false;
        }
      );
  }
  decrement(p: any) {
    p.value = p.value??0
    p.value>0?p.value--:0
  }
  increment(p: any) {
    p.value = p.value??0
    p.value++
  }
  onSubmit() {

  }
}
