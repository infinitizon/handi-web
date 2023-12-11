import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { DurationFormatPipe } from './pipes/duration-format.pipe';
import { SafeHtml } from './pipes/safe-html.pipe';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from './third-party/material.module';
import { BackbuttonComponent } from './components/backbutton/backbutton.component';
import { SuccessfulPageComponent } from '../ini-website/auth/successful-page/successful-page.component';
import { NgxMatIntlTelInputComponent } from 'ngx-mat-intl-tel-input';
import { NgxOtpInputModule } from 'ngx-otp-input';
import { SnackBarComponent } from './components/snack-bar/snack-bar.component';
import { NgApexchartsModule } from 'ng-apexcharts';
import { GatewayComponent } from './dialogs/gateway/gateway.component';
import { GetStartedComponent } from './dialogs/get-started/get-started.component';
import { LinkCscsComponent } from './dialogs/link-cscs/link-cscs.component';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { LogInComponent } from './dialogs/log-in/log-in.component';
import { LottieModule } from 'ngx-lottie';
import { EmptyDataComponent } from './components/empty-data/empty-data.component';
import { ColorPipe, ImagePipe } from './pipes/random-color.pipe';
import { GatewayDialogComponent } from './dialogs/gateway-dialog/gateway-dialog.component';
import { IConfig, provideEnvironmentNgxMask } from 'ngx-mask';
import { LoaderComponent } from './components/loader/loader.component';

const MY_DATE_FORMAT = {
  parse: {
    dateInput: 'DD/MM/YYYY', // this is how your date will be parsed from Input
  },
  display: {
    dateInput: 'MMM DD, YYYY', // this is how your date will get displayed on the Input
    monthYearLabel: 'MMMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY'
  }
};

export function playerFactory() {
  return import(/* webpackChunkName: 'lottie-web' */ 'lottie-web');
}

const maskConfig: Partial<IConfig> = {
  validation: false,
};

@NgModule({
  declarations: [
    DurationFormatPipe,
    SafeHtml,
    BackbuttonComponent,
    SnackBarComponent,
    GatewayComponent,
    GetStartedComponent,
    LinkCscsComponent,
    LogInComponent,
    EmptyDataComponent,
    ColorPipe,
    ImagePipe,
    GatewayDialogComponent,
    LoaderComponent

  ],
  providers: [
    provideEnvironmentNgxMask(maskConfig)
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    NgxMatIntlTelInputComponent,
    NgxOtpInputModule,
    NgApexchartsModule,
    SlickCarouselModule,
    NgbModule,
    LottieModule.forRoot({ player: playerFactory }),
  ],
  exports: [
    CommonModule,
    RouterModule,
    FormsModule, ReactiveFormsModule,
    DurationFormatPipe, SafeHtml,
    MaterialModule,
    BackbuttonComponent,
    NgxMatIntlTelInputComponent,
    NgxOtpInputModule,
    SnackBarComponent,
    NgApexchartsModule,
    GatewayComponent,
    GetStartedComponent,
    LinkCscsComponent,
    SlickCarouselModule,
    NgbModule,
    LogInComponent,
    LottieModule,
    EmptyDataComponent,
    ColorPipe,
    ImagePipe,
    GatewayDialogComponent,
    LoaderComponent
  ]
})
export class SharedModule { }
