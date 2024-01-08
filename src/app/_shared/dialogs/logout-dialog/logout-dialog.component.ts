import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AuthService } from '@app/_shared/services/auth.service';
import { environment } from '@environments/environment';


@Component({
  selector: 'in-logout-dialog',
  templateUrl: './logout-dialog.component.html',
  styleUrls: ['./logout-dialog.component.scss']
})
export class LogoutDialogComponent implements OnInit {

  constructor(private auth: AuthService,
    public _dialogRef: MatDialogRef<LogoutDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private http: HttpClient,
  ) { }

  ngOnInit(): void {
  }

  logout(): void {
    this.auth.logout();
    // this.http.post(`${environment.baseApiUrl}/auth/user/logout`, {},)
    //   .subscribe((response: any) => {
    //     this.auth.logout();
    //     this._dialogRef.close();
    //   },
    //   errResp => {
        this._dialogRef.close();
      // });
  }
}
