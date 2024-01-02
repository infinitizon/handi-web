import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ApplicationContextService } from '@app/_shared/services/application-context.service';
import { IniDashboardService } from '@app/ini-dashboard/ini-dashboard.service';
import { environment } from '@environments/environment';

@Component({
  selector: 'app-vendor-list',
  templateUrl: './vendor-list.component.html',
  // styleUrls: ['./vendor-list.component.scss']
})
export class VendorListComponent implements OnInit {

  agentsDisplayedColumns: any = [
    {name:'expand', title:  '', type: 'expand'},
    { name: 'name', title: 'Name', type: '' },
    { name: 'email', title: 'Email', type: 'contact' },
    { name: 'phone', title: 'Phone', type: '' },
    { name: 'isEnabled', title: 'Enabled', type: '' },
    { name: 'isLocked', title: 'Locked', type: '' },
    { name: 'action', title: '', type: 'action' }
  ];
  agentsDataSource = new MatTableDataSource<any>([]);
  agentsColumnsToDisp = this.agentsDisplayedColumns.map(
    (col: any) => col.name
  );

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  container: any = {};
  create: boolean = false;

  constructor(
    public dashboardService: IniDashboardService,
    private paginator1: MatPaginatorIntl,
    public appContext: ApplicationContextService,
    private http: HttpClient,
    public dialog: MatDialog,
  ) { }

  ngOnInit() {
    setTimeout(() => {
        this.dashboardService.isHome = false;
    });
    this.paginator1.itemsPerPageLabel = 'Rows per page:';
    this.getAgents();
  }

  getAgents() {
    this.container['agentsLoading'] = true;
    this.http
      .get(`${environment.baseApiUrl}/admin/vendors`)
      .subscribe(
        (response: any) => {
          this.container['agents'] = response.data;
          this.container['agentsLoading'] = false;
        },
        (errResp) => {
          this.container['agentsLoading'] = false;
        }
      );
  }

  // createUser(data: any) {
  //   this.create = true;
  //   const createUserDialog = this.dialog.open(CreateUserComponent, {
  //     data: {
  //       role: 'TENANT_ADMIN',
  //       parentData: data
  //     },
  //     // width: '408px',
  //     height: '550px'
  //   });
  //   createUserDialog.afterClosed().subscribe((result) => {
  //     this.getAgents();
  //     this.create = false;
  //   });
  // }

  ngAfterViewInit() {
    this.agentsDataSource.paginator = this.paginator;
  }
}
