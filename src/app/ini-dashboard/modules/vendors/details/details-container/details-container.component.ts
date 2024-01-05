import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { environment } from '@environments/environment';
import { Subscription, of, switchMap } from 'rxjs';

@Component({
  selector: 'app-details-container',
  templateUrl: './details-container.component.html',
  styleUrls: ['./details-container.component.scss']
})
export class DetailsContainerComponent implements OnInit {
  tab = 'info';
  infoSubscription$!: Subscription;
  container: any = {};
  infoData: any = {};
  constructor(
    public aRoute: ActivatedRoute,
    private http: HttpClient,
  ) { }

  ngOnInit() {
    this.infoSubscription$ = this.aRoute.paramMap
    .pipe(
      switchMap((params: any) => {
        this.container['loading'] = true;
        return params.get('id') ? this.http.get(`${environment.baseApiUrl}/admins/vendors/${params.get('id')}`) : of({data: {}});
      })
      // ).subscribe((security: any)  => {
    )
    .subscribe((response: any) => {
      this.infoData = response.data
      this.container['loading'] = false;

    });
  }

}
