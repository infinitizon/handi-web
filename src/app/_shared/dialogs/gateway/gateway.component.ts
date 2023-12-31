import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ApplicationContextService } from '@app/_shared/services/application-context.service';
import { CommonService } from '@app/_shared/services/common.service';
import { FormErrors, ValidationMessages } from './gateway.validators';
import { Router } from '@angular/router';
import { OffersService } from '@app/ini-dashboard/modules/offers/offers.service';

@Component({
  selector: 'app-gateway',
  templateUrl: './gateway.component.html',
  styleUrls: ['./gateway.component.scss']
})
export class GatewayComponent implements OnInit {

  gatewayForm!: FormGroup;
  container: any = {};
  errors: any = [];
  formErrors: any = FormErrors;
  uiErrors: any = FormErrors;
  validationMessages: any = ValidationMessages;

  constructor(
    public commonServices: CommonService,
    public appContext: ApplicationContextService,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<GatewayComponent>,
    private fb: FormBuilder,
    private router: Router,
    public offerService: OffersService
  ) {}

  ngOnInit() {
    this.gatewayForm = this.fb.group({
      amount: ['', [Validators.required]],
      payment: ['', [Validators.required]]
    })
  }


  submit() {
    if(this.data.currency === 'USD') {
         this.router.navigate(['/app/offers/gateway-payment']);
         this.offerService.gatewayDetails = {
          currency: this.data.currency,
          payment_method: this.gatewayForm.get('payment')?.value,
          id: this.data.id
         }
         this.dialog.closeAll();
    }
  }


  controlChanged(ctrlName: string) {
    this.errors = this.commonServices.controlnvalid(this.gatewayForm.get(ctrlName) as FormControl);
    if (Object.keys(this.errors).length === 0) {
      this.errors[ctrlName] = {};
      this.uiErrors[ctrlName] = '';
    }
    this.displayErrors();
  }

  displayErrors() {
    Object.keys(this.formErrors).forEach((control) => {
      this.formErrors[control] = '';
    });
    Object.keys(this.errors).forEach((control: any) => {
      Object.keys(this.errors[control]).forEach((error: any) => {
        this.uiErrors[control] = this.validationMessages[control][error];
      })
    });
  }

}
