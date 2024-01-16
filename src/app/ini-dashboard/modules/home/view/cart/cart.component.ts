import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageDialogComponent } from '@app/_shared/dialogs/message-dialog/message-dialog.component';
import { CommonService } from '@app/_shared/services/common.service';
import { IniDashboardService } from '@app/ini-dashboard/ini-dashboard.service';
import { environment } from '@environments/environment';
import { AuthService } from '@app/_shared/services/auth.service';
import { GMapService } from '@app/_shared/services/google-map.service';
import { ApplicationContextService } from '@app/_shared/services/application-context.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {

  activeAddress: any;
  container: any = {
    cartsLoading: true,
    total: 0,
  };
  providerXterData: any;
  providerId: any;
  subCategoryId: any;
  priceForm!: FormGroup;

  errors: any = [];
  formErrors: any = {};
  uiErrors: any = this.formErrors;
  validationMessages: any = {}

  constructor(
    private location: Location,
    public dashboardService: IniDashboardService,
    public appContext: ApplicationContextService,
    private http: HttpClient,
    private aRoute: ActivatedRoute,
    public commonServices: CommonService,
    public dialog: MatDialog,
    private router: Router,
    private authService: AuthService,
    private gMapService: GMapService,
  ) { }

  ngOnInit() {
    this.getProviderXteristics();
    this.appContext.getUserInformation().subscribe(user=>{
      this.activeAddress = user?.Addresses?.find((u: any)=>u.isActive)
    })
  }

  getProviderXteristics() {
    this.container['cartsLoading'] = true;
    this.http
      .get(`${environment.baseApiUrl}/users/cart`)
      .subscribe({
        next: (response: any) => {
          this.container['cartsLoading'] = false;
          this.providerXterData = response.data;

          const group: any = {};
          this.providerXterData.forEach((p: any) => {
            group[p?.id] = new FormControl(p?.value || null, Validators.required);
            this.validationMessages[p?.id] = {'required': `${p?.ProductVendorCharacter?.ProductCharacter?.name} is required`,}
            this.formErrors[p?.id] = '';
          });
          this.priceForm = new FormGroup(group);
          this.calculatePrice();
          this.priceForm.updateValueAndValidity({ onlySelf: false, emitEvent: true });


        },
        error: (errResp) => {
          this.container['cartsLoading'] = false;
        }
      });
  }
  decrement(p: any) {
    let value = +this.priceForm.get(p?.id)?.value
    value>0?value--:0
    this.priceForm.get(p?.id)?.patchValue(value);
  }
  increment(p: any) {
    let val = +this.priceForm.get(p?.id)?.value
    this.priceForm.get(p?.id)?.patchValue(val+1);
  }
  calculatePrice() {
    this.priceForm.valueChanges.subscribe(pf => {
      this.container['total'] = 0;
      Object.keys(pf).forEach((f:any)=>{
        const obj = this.providerXterData?.find((p:any)=>f==p?.id);
        console.log(f, obj);

        this.container['total'] += (+pf[f] * obj?.ProductVendorCharacter?.price)
      })
    })
  }
  onSubmit() {
    if (this.priceForm.invalid) {
      this.uiErrors = JSON.parse(JSON.stringify(this.formErrors));
      this.errors = this.commonServices.findInvalidControlsRecursive(
        this.priceForm
      );
      this.commonServices.displayErrors(this.formErrors, this.validationMessages, this.errors, this.uiErrors)
      this.container['submitting'] = false;
      return;
    }
    const payload =  this.priceForm.getRawValue();

    this.http.post(`${environment.baseApiUrl}/users/checkout`, payload)
      .subscribe({
        next: (response: any) => {
          this.container['submitting'] = false;
          console.log(response);

          this.commonServices.successSnackBar(response?.message);
        },
        error: (errResp: any) => {
          if(errResp.status === 402) {
            //
            const messageDialog = this.dialog.open(MessageDialogComponent, {
              data: {
                title: 'Login Required', message: errResp?.error?.error?.message,
                acceptButtonText: 'Proceed',cancelButtonText: 'Cancel',
              },
            });
            messageDialog.afterClosed().subscribe((result) => {
              if (result) {
                localStorage.setItem('puchase', JSON.stringify({providerId: this.providerId, subCategoryId: this.subCategoryId, payload}))
                this.authService.redirectUrl = `/app/home/cart/${this.providerId}/${this.subCategoryId}/characteristics`;
                this.router.navigateByUrl(`/auth/login?redirectUrl=/app/home/cart/${this.providerId}/${this.subCategoryId}/characteristics`);
              } else {
                this.location.back();
              }
            });
          } else {
            this.commonServices.openSnackBar(errResp?.error?.error?.message || `Error saving request`);
          }
        }
    });
  }
}
