import { HttpClient } from '@angular/common/http';
import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ChangeDetectorRef,
  NgZone,
  AfterViewInit,
} from '@angular/core';
import {
  combineLatest,
  fromEvent,
  merge,
  Observable,
  Subscription,
  timer,
} from 'rxjs';
import {
  debounceTime,
  switchMap,
  finalize,
  map,
  pairwise,
  filter,
  throttleTime,
} from 'rxjs/operators';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ApplicationContextService } from '@app/shared/services/application-context.service';
import { IniDashboardService } from './ini-dashboard.service';
import { LinkCscsComponent } from '@app/shared/dialogs/link-cscs/link-cscs.component';
import * as moment from 'moment';
import { LogInComponent } from '@app/shared/dialogs/log-in/log-in.component';
import { AuthService } from '@app/shared/services/auth.service';
import { environment } from '@environments/environment';

@Component({
  selector: 'app-ini-dashboard',
  templateUrl: './ini-dashboard.component.html',
  styleUrls: ['./ini-dashboard.component.scss']
})
export class IniDashboardComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('sidenav') sidenav: any;
  @ViewChild(CdkVirtualScrollViewport) scroller!: CdkVirtualScrollViewport;

  sideNavMode: any = 'side';
  sideNavOpen = true;
  resizeObservable$!: Observable<Event>;
  sidenavSubscription$!: Subscription;
  sidenavClickSubscription$!: Subscription;
  isHome!: boolean;
  today = moment().format('MMMM DD, YYYY');
  isDialogOpen: boolean = false;
  userInformation: any;
  userSubscription$!: Subscription;

  constructor(
    public dialog: MatDialog,
    private router: Router,
    private http: HttpClient,
    private appContext: ApplicationContextService,
    private ngZone: NgZone,
    public dashboardService: IniDashboardService,
    private auth: AuthService
  ) {

  }

  ngOnInit() {
    this.getUserInformation();
    this.setupSideBar();
    this.sidenavFunction();
  }


  getUserInformation() {
    this.userSubscription$ = this.http
      .get(`${environment.baseApiUrl}/users`)
      .subscribe(
        (response: any) => {
          this.appContext.userInformation$.next(response.data);
          if (response) {
            this.userInformation = response.data;
            if(this.userInformation.firstLogin) {

            }
          }
        },
        (errResp) => {}
      );
  }

  ngAfterViewInit() {

    this.scroller?.elementScrolled()
      .pipe(
        map(() => this.scroller.measureScrollOffset('bottom')),
        pairwise(),
        filter(([y1, y2]) => y2 < y1 && y2 < 140),
        throttleTime(200)
      )
      .subscribe(() => {
        this.ngZone.run(() => {
          // this.fetchMore();
        });
      });

    const hasCollapsible = document.querySelectorAll('.has-collapsible');

    // Collapsible Menu
    hasCollapsible.forEach(function (collapsible) {
      collapsible.addEventListener('click', function () {
        collapsible.classList.toggle('active');

        // Close Other Collapsible
        hasCollapsible.forEach(function (otherCollapsible) {
          if (otherCollapsible !== collapsible) {
            otherCollapsible.classList.remove('active');
          }
        });
      });
    });
  }

  setupSideBar() {
    this.resizeObservable$ = fromEvent(window, 'resize');
    this.sidenavSubscription$ = this.resizeObservable$
      .pipe(debounceTime(500))
      .subscribe((evt) => this.sidenavFunction());

    let button = document.querySelectorAll('.menu-section-bottom a');
    let sidenavClick$ = fromEvent(button, 'click');

    this.sidenavClickSubscription$ = sidenavClick$.subscribe((evt) => {
      if (window.innerWidth < 991) {
        this.sidenav.close();
      }
    });
  }

  sidenavFunction() {
    let browserWidth = window.innerWidth;
    if (browserWidth < 991) {
      this.sideNavMode = 'over';
      this.sideNavOpen = false;
    } else {
      this.sideNavMode = 'side';
      this.sideNavOpen = true;
    }
  }

  addDetails () {
    const linkCSCSDialog = this.dialog.open(LinkCscsComponent, {
      data: {},
      width: '408px',
    });

    linkCSCSDialog.afterClosed().subscribe((result) => {
      if (result) {
      }
    });
  }


  route(routeName: any) {
       if(this.auth.isLoggedIn()) {
         this.router.navigate([routeName]);
       } else {
        this.isDialogOpen = true;
        const loginDialog = this.dialog.open(LogInComponent, {
          data: {},
          width: '552px',
        });

        loginDialog.afterClosed().subscribe((result) => {
          if (result) {
          }
          this.isDialogOpen = false;
        });
       }
  }

  ngOnDestroy() {
    if (this.sidenavSubscription$) this.sidenavSubscription$.unsubscribe();
    if (this.sidenavClickSubscription$)
      this.sidenavClickSubscription$.unsubscribe();

      this.userSubscription$.unsubscribe();
  }

}
