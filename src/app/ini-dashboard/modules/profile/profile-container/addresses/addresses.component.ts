import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddAddressComponent } from '@app/_shared/dialogs/add-address/add-address.component';
import { ApplicationContextService } from '@app/_shared/services/application-context.service';

@Component({
  selector: 'app-addresses',
  templateUrl: './addresses.component.html',
  styleUrls: ['./addresses.component.scss']
})
export class AddressesComponent implements OnInit {

  container: any = {};
  userInformation!: any;

  constructor(
    public appContext: ApplicationContextService,
    private dialog: MatDialog,
  ) { }

  ngOnInit() {
    this.appContext
    .getUserInformation()
    .subscribe({
      next: (data: any) => {
        this.userInformation = data.Addresses;


      },
    });
  }

  addAddress(): void {
    const getUrl = window.location;
    const data = {}
    const addressDialog = this.dialog.open(AddAddressComponent, {
      data,
      minWidth: '30%',
      disableClose: false,
    });

    addressDialog.afterClosed().subscribe((response) => {

    })
  }

}
