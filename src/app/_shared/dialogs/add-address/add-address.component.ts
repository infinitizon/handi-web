import { Component, ElementRef, Inject, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ApplicationContextService } from '@app/_shared/services/application-context.service';
import { CommonService } from '@app/_shared/services/common.service';
import { FormErrors, ValidationMessages } from './add-address.validators';
import { GMapService, Maps } from '@app/_shared/services/google-map.service';
import { environment } from '@environments/environment';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpClient } from '@angular/common/http';
import { SnackBarComponent } from '@app/_shared/components/snack-bar/snack-bar.component';

@Component({
  selector: 'app-add-address',
  templateUrl: './add-address.component.html',
  styleUrls: ['./add-address.component.scss']
})
export class AddAddressComponent implements OnInit {
  @ViewChild('search') searchElementRef:  ElementRef = {
    nativeElement: undefined
  };
  container: any = {countdown: 20};
  formErrors: any = FormErrors;
  uiErrors: any = FormErrors;
  validationMessages: any = ValidationMessages;
  addressForm!: FormGroup;
  submitting = false;
  errors: any = [];


  constructor(
    public commonServices: CommonService,
    public appContext: ApplicationContextService,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<AddAddressComponent>,
    private gMapService: GMapService,
    private renderer: Renderer2,
    private http: HttpClient,
    private _snackBar: MatSnackBar,
    private fb: FormBuilder,
  ) {
    let interval = setInterval(()=>{
      this.container.countdown--
      if(this.container['loadedMaps']) {
        clearInterval(interval);
        this.container.countdown = null
      }
      if(this.container.countdown === 0) window.location.reload()
    }, 1000)
    this.gMapService.api.then((maps) => {
      this.initAutocomplete(maps);
      this.container['loadedMaps'] = true;
      this.renderer.setProperty(this.searchElementRef.nativeElement, 'placeholder', 'Search and pick your address here...');
    });
  }

  ngOnInit() {
    this.addressForm = this.fb.group(
      {
        phone: ['', [Validators.required]],
        address: ['', [Validators.required]],
      }
    );
  }

  submit() {
    this.submitting = true;
     if (this.addressForm.invalid) {
       this.uiErrors = JSON.parse(JSON.stringify(this.formErrors))
       this.errors = this.commonServices.findInvalidControlsRecursive(this.addressForm);
       this.displayErrors();
       this.submitting = false;
       return;
     }

     const fd = JSON.parse(JSON.stringify(
       this.addressForm.value
     ));
     fd.Addresses = [{
        no: this.container?.address?.number,
        address1: this.container?.address?.address1,
        address2: this.container?.address?.address2,
        city: this.container?.address?.city,
        lga: this.container?.address?.lga,
        state: this.container?.address?.state?.code,
        country: this.container?.address?.country?.code,
        lng: this.container?.address?.geometry?.lng,
        lat: this.container?.address?.geometry?.lat,
        phone: fd.phone
     }];
     delete fd.address;
     delete fd.phone;  
    //  console.log(fd); return


     this.http.post(`${environment.baseApiUrl}/users/address`, fd,)
       .subscribe((response: any) => {
         this.submitting = false;
        //  this.authService.email$.next(fd.email);
         this.successSnackBar("Address added successfully");
        this.dialogRef.close();
                },
       errResp => {
          this.submitting = false;
         this.openSnackBar(errResp?.error?.error?.message)
       });
  }

  initAutocomplete(maps: Maps) {
    const autocomplete = new maps.places.Autocomplete(
      this.searchElementRef.nativeElement
    );
    autocomplete.addListener('place_changed', () => {
      const  place  =  autocomplete.getPlace();
      this.container.address = this.gMapService.getAddresses(place?.address_components);
      this.container.address = {...this.container.address, geometry: {lng: place?.geometry?.location?.lng(), lat: place?.geometry?.location?.lat()}}
    });
  }

  controlChanged(ctrlName: string) {
    this.errors = this.commonServices.controlnvalid(this.addressForm.get(ctrlName) as FormControl);
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

}
