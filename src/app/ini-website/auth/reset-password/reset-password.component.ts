import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CommonService } from '@app/_shared/services/common.service';
import { FormErrors, ValidationMessages } from './reset-password.validators';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {

  resetPasswordForm!: FormGroup;
  container: any = {};
  errors: any = [];
  formErrors: any = FormErrors;
  uiErrors: any = FormErrors;
  validationMessages: any = ValidationMessages;

  constructor(
    private fb: FormBuilder,
    private commonServices: CommonService,
    ) { }

  ngOnInit() {

    this.resetPasswordForm = this.fb.group({
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(6),
          this.commonServices.regexValidator(
            new RegExp(this.commonServices.oneDigit),
            { oneDigit: '' }
          ),
          this.commonServices.regexValidator(
            new RegExp(this.commonServices.oneLowerCase),
            { oneLowerCase: '' }
          ),
          this.commonServices.regexValidator(
            new RegExp(this.commonServices.oneUpperCase),
            { oneUpperCase: '' }
          ),
          this.commonServices.regexValidator(
            new RegExp(this.commonServices.specialChar),
            { specialChar: '' }
          ),
        ],
      ],
      confirmPassword: ['', [Validators.required]],
    },
    { validators: this.commonServices.mustMatch('password', 'confirmPassword') });
  }

  showEyes() {
    this.container['fieldTextType'] = !this.container['fieldTextType'];
  }

  clearPassword(field: string) {
    this.resetPasswordForm.get(field)?.patchValue('')
  }

  controlChanged(ctrlName: string) {
    this.errors = this.commonServices.controlnvalid(this.resetPasswordForm.get(ctrlName) as FormControl);
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
