import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { SnackBarComponent } from '@app/_shared/components/snack-bar/snack-bar.component';
import { ApplicationContextService } from '@app/_shared/services/application-context.service';
import { AuthService } from '@app/_shared/services/auth.service';
import { CommonService } from '@app/_shared/services/common.service';
import { environment } from '@environments/environment';
import { take } from 'rxjs';
import { Crypto } from '@app/_shared/classes/Crypto';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  container: any = {};
  submitting: boolean = false;

  constructor(
    private fb: FormBuilder,
    private commonService: CommonService,
    private router: Router,
    private http: HttpClient,
    private _snackBar: MatSnackBar,
    private authService: AuthService,
    public appContext: ApplicationContextService,
  ) {}

  ngOnInit() {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/app/']);
    }

    this.loginForm = this.fb.group({
      email: [
        null,
        [Validators.required, Validators.pattern(this.commonService.email)],
      ],
      password: [null, [Validators.required]],
      // rememberMe: [null],
    });
  }

  onSubmit() {
    const fd = JSON.parse(JSON.stringify(this.loginForm.value));
    const encrypted = new Crypto({
      aesKey: environment.SECRET_KEY,
      ivKey: environment.IV_KEY,
    }).encryptWithKeyAndIV(fd.password);

    fd.password = encrypted;

    this.submitting = true;
    this.http
      .post(`${environment.baseApiUrl}/auth/user/login`, fd)
      .pipe(take(1))
      .subscribe(
        (response: any) => {
          this.submitting = false;
            this.authService.setToken(response);
            this.appContext.userInformation$.next(response.user);
              this.router.navigate(['/app/home']);
        },
        (errResp) => {
          this.submitting = false;
          this.openSnackBar(errResp?.error?.error?.message);
          if (errResp.status == 423) {
            this.authService.email$.next(fd.email);
            this.http
              .post(
                `${environment.baseApiUrl}/auth/otp/generate`,
                 {email: fd.email, subject: 'Verification'}
              )
              .subscribe((response: any) => {});
              this.router.navigate(['/auth/verify-otp']);
          }
        }
      );
  }

  showEyes() {
    this.container['fieldTextType'] = !this.container['fieldTextType'];
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
}
