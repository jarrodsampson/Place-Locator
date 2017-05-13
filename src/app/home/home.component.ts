import { Component, OnInit } from '@angular/core';
import { MzToastService } from 'ng2-materialize';
import { APIService } from '../services/APIService';
import 'rxjs/Rx';

@Component({
  selector: 'app-root',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {


  place = {
    zipcode: ""
  };
  zoom = 12;
  placeData = {
    geometry: {
      location: {
        lat: 51.678418,
        lng: 7.809007
      }
    },
    formatted_address: ""
  };

  markers = [];
  markerHold = {};
  placesResults = [];

  placeDataHidden = true;
  placesResultsHidden = true;

  location = {};
  savedZipCode = "";

  temp = {
    lat: "",
    lng: ""
  };

  constructor(private _apiService: APIService, private toastService: MzToastService) {
  }

  ngOnInit() {
    this.getLocationPrompt();
  }

  setPosition(position){
    this.location = position.coords;
    console.log(position.coords);
    this.getLocationFromPrompt(this.location);
    scrollTo(0,0);
  }

  getLocationPrompt() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(this.setPosition.bind(this));
    }
  }

  getLocation(place) {
    //console.log(place.zipcode);

    // dont call if the zip code is the same
    if (this.savedZipCode === place.zipcode){return;}

    this._apiService.getByZipCode(place.zipcode).subscribe(
        data => {
          if (data.status === "OK") {
            this.placeData = data.results[0];
          }
        },
        err => console.error(err),
        () => {
          console.log("json data", this.placeData);
          this.placeDataHidden = false;
          this.savedZipCode = place.zipcode;
        }
      );
  }

  getLocationFromPrompt(location) {
    this._apiService.getByLatAndLng(location.latitude, location.longitude).subscribe(
        data => {
          if (data.status === "OK") {
            this.placesResults = data.results;
          }
        },
        err => console.error(err),
        () => {

          this.placeData = {
            geometry: {
              location: {
                lat: location.latitude,
                lng: location.longitude
              }
            },
            formatted_address: this.placesResults[0].formatted_address
          };

          this.place.zipcode = this.placesResults[0].address_components[this.placesResults[0].address_components.length -1].short_name;

          console.log("json data", this.placesResults);
          this.placeDataHidden = false;
        }
      );
  }

  viewArea(place, lat, lng) {
    //console.log(place.radius);

    this._apiService.getByRadius(place.radius, lat, lng).subscribe(
        data => {
          if (data.status === "OK") {
            this.placesResults = data.results;
          }
        },
        err => console.error(err),
        () => {
          console.log("json data", this.placesResults);
          this.placesResultsHidden = false;
        }
      );
  }

  // markers
  mapTemp($event: any) {
    this.temp.lat = $event.coords.lat;
    this.temp.lng = $event.coords.lng;
  }

  mapClicked(marker) {
    var markCount = this.markers.length + 1;
    this.markers.push({
      lat: this.temp.lat,
      lng: this.temp.lng,
      title: marker.title || "Marker " + markCount,
      description: marker.desc || "None Set",
      number: markCount + ""
    });
    console.log(this.markers);
    this.toastService.show("New Location Added", 2500);
    this.markerHold = {};
  }

  clickedMarker(label: string, index: number) {
    console.log(`clicked the marker: ${label || index}`)
  }

  markerDragEnd(marker, $event: MouseEvent) {
    console.log('dragEnd', marker, $event);
    this.toastService.show(marker.title + " has been moved.", 2500);
  }

  clearAll() {
    this.markers = [];
    this.toastService.show("All markers have been cleared.", 2500);
  }

  delete(i, markerTitle) {
    this.markers.splice(i, 1);
    console.log(i);
    this.toastService.show(markerTitle + " has been removed.", 2500);
  }

  showOnMap(marker) {
    console.log(marker);
    this.placeData.geometry.location.lat = marker.lat;
    this.placeData.geometry.location.lng = marker.lng;
    scrollTo(0,0);
  }

}

