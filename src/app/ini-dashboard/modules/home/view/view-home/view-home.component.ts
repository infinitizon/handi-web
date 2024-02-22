import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
// import { GetStartedComponent } from '@app/_shared/dialogs/get-started/get-started.component';
import { environment } from '@environments/environment';

@Component({
  selector: 'app-view-home',
  templateUrl: './view-home.component.html',
  styleUrls: ['./view-home.component.scss']
})
export class ViewHomeComponent implements OnInit {

  container: any = {
    categoriesLoading: true
  };
  categoriesData: any;

  constructor(
    public dialog: MatDialog,
    private http: HttpClient
  ) {  }

  ngOnInit() {
    this.getCategories();
  }

  getCategories() {
    this.container['categoriesLoading'] = true;
    this.http
      .get(`${environment.baseApiUrl}/products/category`)
      .subscribe(
        (response: any) => {
          this.categoriesData = response.data;
          this.container['categoriesLoading'] = false;       },
        (errResp) => {
          this.container['categoriesLoading'] = false;
        }
      );
  }
}
