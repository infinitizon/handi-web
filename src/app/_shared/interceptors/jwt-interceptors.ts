import { Injectable, Injector } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { catchError} from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { environment } from '@environments/environment';


@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(
    private auth: AuthService
  ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): any {
    // add auth header with jwt if user is logged in and request is to the api url
    const isLoggedIn = this.auth.getToken();


    if (isLoggedIn) {
      const getUrl = new URL(request.url);

      if (getUrl.origin && environment.ZANIBAL_BASES.includes(getUrl.origin)) {
          let credentials = btoa(`tradeinuser:G0the3n3erg_!`);
          request = request.clone({
            setHeaders: {
              Authorization: `Basic ${credentials}`,
            },
          });
      } else if (getUrl.origin && environment.FUND_BASES.includes(getUrl.origin) ) {
        request = request.clone({
          setHeaders: {
            Authorization: `Bearer KEY_INVEST-NAIJA`,
            // Bypass-Tunnel-Reminder:
          },
        });
      }
      else {
          request = request.clone({
            setHeaders: {
              Authorization: this.auth.getToken(),
              "x-uuid-token": this.auth.getUUIDToken(),
            },
          });
      }
    }

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
          if ([401, 411].includes(error.status)) {
            this.auth.logout();
          }
          throw error;
      })
    );
  }
}
