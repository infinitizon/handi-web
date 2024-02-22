import { AnimationOptions } from 'ngx-lottie';
import { AnimationItem } from 'ngx-lottie/lib/symbols';
import { HttpClient } from '@angular/common/http';
import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { OffersService } from '@app/ini-dashboard/modules/offers/offers.service';
import { User } from '@app/_shared/models/user-model';
import { ApplicationContextService } from '@app/_shared/services/application-context.service';
import { environment } from '@environments/environment';
import { Observable, Subscription, startWith, switchMap, take } from 'rxjs';
import * as moment from 'moment';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-view-orders',
  templateUrl: './view-orders.component.html',
  styleUrls: ['./view-orders.component.scss']
})
export class ViewOrdersComponent implements OnInit {
  options: AnimationOptions = {
    path: 'https://assets2.lottiefiles.com/packages/lf20_olbyptqd.json',
  };

  container: any = {};
  userInformation!: User;
  orders!: any;

  paginationData: any = {};
  total_count = 0;
  pageSize = 5;

  emptyState = {
    title: 'No orders',
    subTitle: 'There are no orders available yet',
  };

  today = moment().format('MMM D, YYYY');
  yesterday = moment().subtract(1, 'days').format('MMM D, YYYY');
  neworders = new MatTableDataSource<any>([]);
  mainSubscription$!: Subscription;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  maxHeight: number = 80;
  //set these to false to get the height of the expended container
  public isCollapsed: boolean = false;
  public isCollapsable: boolean = false;
  isDialogOpen: boolean = false;
  showChat: boolean = false;


  orderData: any;
  constructor(
    private router: Router,
    private offerService: OffersService,
    public appContext: ApplicationContextService,
    private http: HttpClient,
    private _changeDetectorRef: ChangeDetectorRef,
    private dialog: MatDialog,
    private elementRef: ElementRef
  ) {}

  ngOnInit() {
    this.appContext
      .getUserInformation()
      .pipe(take(1))
      .subscribe({
        next: (data: User) => {
          this.userInformation = data;
        },
      });
    this.container['ordersLoading'] = true;
  }

  ngAfterViewInit() {
    $('.hide-invest-form').on('click', function () {
      $('#overlay').hide(50);

    }
    );

    let currentHeight =
      this.elementRef.nativeElement.getElementsByTagName('div')[0].offsetHeight;
    //collapsable only if the contents make container exceed the max height
    // console.log(currentHeight);
    if (currentHeight > this.maxHeight) {
      this.isCollapsed = true;
      this.isCollapsable = true;
    }

    this.neworders.paginator = this.paginator;
    this.getOrders();
  }

  show(id: string, createdAt?: any, amount?: any, status?: any, data?: any) {
    $('#overlay').show(50);
    this.isDialogOpen = true;
    // console.log(id);
    this.getOrderDetail(id, createdAt, amount, status);
    this.orderData = data;
  }

  getOrderDetail(id: any, createdAt: any, amount: any, status: any) {
    this.http.get(`${environment.baseApiUrl}/users/cart?orderId=${id}`)
      .subscribe({
        next: (response: any) => {
          this.container.orders = response.data;
          this.container.createdAt = createdAt;
          this.container.id = id
          this.container.amount = amount;
          this.container.status = status;
          this.container.total = response.count;
          this.container['ordersLoading'] = false;
        },
        error: (errResp) => {
          // this.container['paymentLoading'] = false;
        }
      });
  }

  hide() {
    this.isDialogOpen = false;
  }

  getOrders() {
    this.mainSubscription$ = this.paginator.page
    .pipe(
      startWith({}),
      switchMap(() => {
      return  this.http
        .get(`${environment.baseApiUrl}/admin/vendor/orders?page=${this.paginator.pageIndex}&perPage=${this.paginator.pageSize}`)
      })
    ).subscribe(
        (response: any) => {
          this.neworders = new MatTableDataSource<any>(response.data);
          this.orders = response.data;
          this.orders = this.orders.map((t: any) => {
            t.createdAt = moment(t.createdAt).format('MMM D, YYYY');
            return t;
          });

          this.orders = this.orders?.sort((a: any, b: any) =>
            a['createdAt'] > b['createdAt'] ? 1 : -1
          );

          this.orders = this.orders?.reduce((prev: any, now: any) => {
            if (!prev[now['createdAt']]) {
              prev[now['createdAt']] = [];
            }
            prev[now['createdAt']].push(now);
            return prev;
          }, {});
          this.total_count = response.total;
          this.container['ordersLoading'] = false;
        },
        (errResp) => {
          // this.container['paymentLoading'] = false;
        }
      );
  }

  objectKey(obj: any) {
    return obj
      ? Object.keys(obj).sort((a: any, b: any) => (b > a ? 1 : -1))
      : null;
  }



  ngOnDestroy(): void {
    this.mainSubscription$.unsubscribe();
  }

  animationCreated(animationItem: AnimationItem): void {
    // console.log(animationItem);
  }
}

