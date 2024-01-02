import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, Validators, } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackBarComponent } from '@app/_shared/components/snack-bar/snack-bar.component';
import { CommonService } from '@app/_shared/services/common.service';
import { FileUploadControl, FileUploadValidators, } from '@iplab/ngx-file-upload';
import { FormErrors, ValidationMessages, } from './vendor-detail.validators';
import { environment } from '@environments/environment';
import { take } from 'rxjs';
import { AuthService } from '@app/_shared/services/auth.service';
import { saveAs } from 'file-saver';
import { Router } from '@angular/router';

@Component({
  selector: 'app-vendor-detail',
  templateUrl: './vendor-detail.component.html',
  // styleUrls: ['./vendor-detail.component.scss'],
})
export class VendorDetailComponent implements OnInit {
  receivingAgentForm!: FormGroup;
  submitting: boolean = false;

  errors: any = [];
  formErrors: any = FormErrors;
  uiErrors: any = FormErrors;
  validationMessages: any = ValidationMessages;
  file: Array<File> = [];
  public fileUploadControl = new FileUploadControl(
    {
      listVisible: true,
      discardInvalid: true,
      multiple: false,
    },
    FileUploadValidators.filesLimit(1)
  );
  container: any = {};
  constructor(
    private fb: FormBuilder,
    private commonServices: CommonService,
    private http: HttpClient,
    private _snackBar: MatSnackBar,
    private auth: AuthService,
    private router: Router,
    public _dialogRef: MatDialogRef<VendorDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {
    this.receivingAgentForm = this.fb.group({
      name: ['', [Validators.required]],
      email: [
        '',
        [Validators.required, Validators.pattern(this.commonServices.email)],
      ],
      phone: ['', [Validators.required]],
      address: [''],
      fileType: ['vendor'],
    });
  }

  onSubmit() {
    const fd = JSON.parse(JSON.stringify(this.receivingAgentForm.value));
    this.submitting = true;
    this.http
      .post(`${environment.baseApiUrl}/admin/tenants`, fd)
      .pipe(take(1))
      .subscribe(
        (response: any) => {
          this.submitting = false;
          this.successSnackBar('Receiving Agent created successfully');
          this.router.navigate([
            '/app/receiving-agents/view/view-receiving-agent',
          ]);
          this.receivingAgentForm.reset();
        },
        (errResp) => {
          this.submitting = false;
          this.openSnackBar(errResp?.error?.error?.message);
        }
      );
  }

  controlChanged(ctrlName: string) {
    this.errors = this.commonServices.controlnvalid(
      this.receivingAgentForm.get(ctrlName) as FormControl
    );
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
      });
    });
  }

  downloadTemplate() {
    const filterType = 'xlsx';
    const endpoint = `/admin/tenants/templates?templateName=agents`;
    this.submitting = true;
    // let searchTerms = '?';
    // if (this.startDate && this.endDate) {
    // searchTerms += 'start_date='+this.datepipe.transform(this.startDate, 'yyyy-MM-dd');
    // searchTerms += '&end_date='+this.datepipe.transform(this.endDate, 'yyyy-MM-dd');
    // }
    let headers = new HttpHeaders()
      .append('Authorization', `Bearer ${this.auth.getToken()}`)
      .append('Bypass-Tunnel-Reminder', 'juwon'); //.append('Content-Type', undefined);
    let header: any = { headers };
    header['responseType'] = 'arraybuffer';
    header['observe'] = 'response';

    this.http.get(`${environment.baseApiUrl}${endpoint}`, header).subscribe(
      (response: any) => {
        // console.log(filter['filetype']);

        this.submitting = false;
        let blob = new Blob([response.body], {
          type: response.headers.get('content-type'),
        });
        saveAs(blob, `Receiving Agent.xlsx`);
      },
      (errResp) => {
        this.openSnackBar(errResp?.statusText);
        this.submitting = false;
      }
    );
  }

  openSnackBar(message: string) {
    this._snackBar.openFromComponent(SnackBarComponent, {
      duration: 2000,
      data: {
        message: message,
        icon: 'ri-close-circle-fill',
      },
      panelClass: ['error'],
    });
  }

  successSnackBar(message: string) {
    this._snackBar.openFromComponent(SnackBarComponent, {
      duration: 2000,
      data: {
        message: message,
        icon: 'ri-close-circle-fill',
      },
      panelClass: ['success'],
    });
  }

  uploadAgent() {
    this.submitting = true;
    if (!this.file) {
      this.openSnackBar('Add Proof');
      this.submitting = false;
    } else {
      const formData = new FormData();
      formData.append('sheet', this.file[0]);
      formData.append('fileType', 'agent');
      this.http
        .post(`${environment.baseApiUrl}/admin/tenants`, formData)
        .subscribe(
          (response: any) => {
            this.successSnackBar('Receiving agents Uploaded Successfully');
            this.router.navigate([
              '/app/receiving-agents/view/view-receiving-agent',
            ]);
            this.submitting = false;
          },
          (errorResp) => {
            this.openSnackBar(errorResp?.error?.error?.message);
            this.submitting = false;
          }
        );
    }
  }
}
