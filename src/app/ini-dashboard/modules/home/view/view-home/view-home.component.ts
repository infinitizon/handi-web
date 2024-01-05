import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GetStartedComponent } from '@app/_shared/dialogs/get-started/get-started.component';
import { environment } from '@environments/environment';

@Component({
  selector: 'app-view-home',
  templateUrl: './view-home.component.html',
  styleUrls: ['./view-home.component.scss']
})
export class ViewHomeComponent implements OnInit {

  container: any = {
    categoriesLoading: true
  };
  categoriesData: any;

  @ViewChild('addresstext') addresstext:  ElementRef = {
    nativeElement: undefined
  };
	@ViewChild('gmap') gmapElement:  any;

  constructor(
    public dialog: MatDialog,
    private http: HttpClient
  ) { }

  ngOnInit() {
    this.getCategories();
  }
  ngAfterViewInit():  void {
		this.getPlaceAutocomplete();
  }

  getCategories() {
    this.container['categoriesLoading'] = true;
    this.http
      .get(`${environment.baseApiUrl}/products/category`)
      .subscribe(
        (response: any) => {
          this.categoriesData = response;
          this.container['categoriesLoading'] = false;       },
        (errResp) => {
          this.container['categoriesLoading'] = false;
        }
      );
  }
  getPlaceAutocomplete() {
		const  autocomplete  =  new google.maps.places.Autocomplete(this.addresstext.nativeElement);
		google.maps.event.addListener(autocomplete, 'place_changed', () => {
			const  place  =  autocomplete.getPlace();
      console.log(place);
      this.getAddresses(place?.address_components);

			const  myLatlng  =  place?.geometry?.location;
			const  map  =  new google.maps.Map(this.gmapElement.nativeElement, {
				zoom:  15,
				center:  myLatlng
			});
			const  marker  =  new google.maps.Marker({
				position:  myLatlng,
				title:  place.name,
			});
			marker.setMap(map);
      marker.setDraggable(true)
      marker.addListener('dragend', (event: any) => {
        const geocoder = new google.maps.Geocoder();
        geocoder.geocode({location: event.latLng },  (results, status)=>{
          if (status == google.maps.GeocoderStatus.OK) {
            this.getAddresses(results?.find(a=>a.types.includes("street_address") && !a.plus_code)?.address_components);
          }
        })
      })
		});
  }
  getAddresses(address_components: any) {
    for(var i = 0; i < address_components.length; i += 1) {
      var addressObj = address_components[i];
      for(var j = 0; j < addressObj.types.length; j += 1) {
        // if (addressObj.types[j] === 'country') {
          console.log(addressObj.types[j], addressObj.long_name, addressObj.short_name);
        // }
      }
    }
  }
}
