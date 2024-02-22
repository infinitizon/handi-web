import { Component, OnInit } from '@angular/core';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { HttpClient } from '@angular/common/http';
import { ApplicationContextService } from '@app/_shared/services/application-context.service';
import { environment } from '@environments/environment';

@Component({
  selector: 'app-security',
  templateUrl: './security.component.html',
  styleUrls: ['./security.component.scss'],
})
export class SecurityComponent implements OnInit {
  enableN: boolean = false;
  container: any = {};
  userInformation!: any;
  constructor(
    private http: HttpClient,
    public appContext: ApplicationContextService
  ) {}

  ngOnInit() {
    this.appContext.getUserInformation().subscribe({
      next: (data: any) => {
        this.userInformation = data;
      },
    });
  }

  enableNotify() {
    this.enableN = !this.enableN;
  }

  onToggle2FA(event: MatSlideToggleChange) {
    this.container['setting2fa'] = true;
    this.http
      .patch(`${environment.baseApiUrl}/users/profile/update`, {twoFactorAuth: event.checked})
      .subscribe({
        next: (response: any) => {
          this.container['setting2fa'] = false;
          this.appContext.userInformation$.next(response.data);
        },
        error: (errResp) => {
          this.container['setting2fa'] = false;
          console.log(errResp);
        }
      });
  }

  onChangePassword() {

  }
}
