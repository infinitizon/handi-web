import { HttpClient } from '@angular/common/http';
import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatPaginatorModule, MatPaginatorIntl} from '@angular/material/paginator';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import { environment } from '@environments/environment';
import { Location } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { AddCategoryComponent } from '../../dialog/add-category/add-category.component';

@Component({
  selector: 'app-categories-list',
  templateUrl: './categories-list.component.html',
  styleUrls: ['./categories-list.component.scss']
})
export class CategoriesListComponent implements OnInit {
  categoriesDisplayedColumns: any = [
    { name: 'title', title: 'Title', type: '' },
    { name: 'summary', title: 'Summary', type: '' },
    { name: 'createdAt', title: 'Date', type: 'date' }
  ];
  categoriesDataSource = new MatTableDataSource<any>([]);
  categoriesColumnsToDisp = this.categoriesDisplayedColumns.map((col: any) => col.name);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  container: any = {};
  total_count: number = 0;
  pageSize: number = 10;

  constructor(
    private paginator1: MatPaginatorIntl,
    private http: HttpClient,
    private location: Location,
    private dialog: MatDialog,
  ) { }

  ngOnInit() {
    this.getCategories();
    this.paginator1.itemsPerPageLabel = 'Rows per page:';
  }

  getCategories() {
    this.container['categoriesLoading'] = true;
    this.http
      .get(`${environment.baseApiUrl}/products/category`)
      .subscribe(
        (response: any) => {
          this.categoriesDataSource = new MatTableDataSource<any>(response);
          // this.total_count = response.data.length;
          this.container['categoriesLoading'] = false;
        },
        (errResp) => {
          this.container['categoriesLoading'] = false;
        }
      );
  }


  ngAfterViewInit() {
    this.categoriesDataSource.paginator = this.paginator;
  }

  addCategory() {
    const data = {};
    const categoryDialog = this.dialog.open(AddCategoryComponent, {
      data,
      minWidth: '30%',
      disableClose: false,
    });

    categoryDialog.afterClosed().subscribe((response) => {
      this.categoriesDataSource = new MatTableDataSource<any>([]);
       this.getCategories();
    })
  }

  viewCategory(element: any) {
    const data = {};
    const categoryDialog = this.dialog.open(AddCategoryComponent, {
      data: element,
      minWidth: '30%',
      disableClose: false,
    });

    categoryDialog.afterClosed().subscribe((response) => {
      this.categoriesDataSource = new MatTableDataSource<any>([]);
       this.getCategories();
    })
  }

  goBack() {
    this.location.back();
  }

}
