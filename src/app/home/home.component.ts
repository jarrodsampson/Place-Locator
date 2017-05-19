import { Component, OnInit } from '@angular/core';
import { MzToastService } from 'ng2-materialize';
import { APIService } from '../services/APIService';
import {LocationStore} from "../services/Store";
import { Title } from '@angular/platform-browser';
import 'rxjs/Rx';

@Component({
  selector: 'app-root',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  details = {};
  isEditing = false;

  search =  {
    title: ""
  };

  place = {
    zipcode: ""
  };
  zoom = 12; // initial zoom
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
  savedZipCode = ""; // for later comparisons
  savedType = {      // for later comparisons
    type: "",
    show: ""
  };
  radius = "";       // for later comparisons

  temp = {           // holder until box is verified in template
    lat: "",
    lng: ""
  };

  notLoading = false;

  categories = [];
  locationStore: LocationStore;

  constructor(private _apiService: APIService, private toastService: MzToastService, locationStore: LocationStore, private titleService: Title) {
    this.titleService.setTitle( "Place Locator - Home" );
    this.locationStore = locationStore;
    console.log(locationStore.locations);
  }

  ngOnInit() {
    /*
        get markers from local storage
    */
    this.markers = this.locationStore.locations;
    /*
        Get the local categories list for google places
     */
    this._apiService.loadPlaceTypes().subscribe(
      data => {
          this.categories = data.data;
      },
      err => console.error(err),
      () => {
        console.log("categories data", this.categories);
      }
    );

    /*
       Get saved location to start if not users first time, otherwise prompt
     */
    if (localStorage.getItem('findPlaces-location')) {
      this.placeData = JSON.parse(localStorage.getItem('findPlaces-location'));
      console.log("HE", this.placeData);
      this.placeDataHidden = false;
    } else {
      this.getLocationPrompt();
    }
  }

  /*
      Add position to map
   */
  setPosition(position){
    this.location = position.coords;
    console.log(position.coords);
    this.getLocationFromPrompt(this.location);
    scrollTo(0,0);
  }

  /*
      Native Location notification box
   */
  getLocationPrompt() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(this.setPosition.bind(this));
    }
  }

  /*
       Get location by Zip Code
   */
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

          // TODO: save location data for user's next time here, need to replace PlaceData name
        }
      );
  }

  /*
       Get location from longitude and latitude
   */
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

          // save for next visit
          localStorage.setItem('findPlaces-location', JSON.stringify(this.placeData));

          this.place.zipcode = this.placesResults[0].address_components[this.placesResults[0].address_components.length -1].short_name;
          this.savedZipCode = this.place.zipcode;
          console.log("json data", this.placesResults);
          this.placeDataHidden = false;
        }
      );
  }

  /*
       Area search for your designated area
   */
  viewArea(place, lat, lng) {
    //console.log(place.radius);

    if (this.savedType.type.length > 0) {

      if (this.savedZipCode === place.zipcode && place.radius === this.radius) {
        return;
      }
      console.log(this.savedZipCode, this.radius, this.savedType.type);
      this.notLoading = false;

      this._apiService.getByRadius(place.radius, lat, lng, this.savedType.type).subscribe(
        data => {
          if (data.status === "OK") {
            this.placesResults = data.results;
          }
        },
        err => console.error(err),
        () => {
          console.log("json data", this.placesResults);
          this.placesResultsHidden = false;
          this.notLoading = false;
          this.radius = place.radius;
        }
      );

    }
  }

  // markers coordinated being held until popup prompt is confirmed
  mapTemp($event: any) {
    this.temp.lat = $event.coords.lat;
    this.temp.lng = $event.coords.lng;
  }

  /*
       Save Map target
   */
  mapClicked(marker) {
    var markCount = this.markers.length + 1;

    this.toastService.show("New Location Added", 2500);
    this.locationStore.add(
      markCount + "",
      marker.title || "Marker " + markCount,
      marker.desc || "None Set",
      this.temp.lat,
      this.temp.lng,
      false,
      false
    );
    this.markerHold = {};
  }

  clickedMarker(label: string, index: number) {
    //console.log(`clicked the marker: ${label || index}`)
  }

  /*
    Update Marker Location
   */
  markerDragEnd(marker, $event: any) {
    console.log('dragEnd', marker, $event);
    this.toastService.show(marker.title + " has been moved.", 2500);
    console.log($event.coords);
    marker._lat = $event.coords.lat;
    marker._lng = $event.coords.lng;
    this.locationStore.updateItem(marker);
  }

  /*
     Delete Single Marker
   */
  delete(marker) {
    //this.markers.splice(i, 1);
    this.locationStore.remove(marker);
    console.log(marker);
    this.toastService.show(marker.title + " has been removed.", 2500);
  }

  /*
     On Saved Item click, take us directly to that position on the map with zoom
   */
  showOnMap(marker) {
    console.log(marker);
    this.placeData.geometry.location.lat = marker.lat;
    this.placeData.geometry.location.lng = marker.lng;
    this.zoom = 18;
    scrollTo(0,0);
  }

  /*
     Saved Location from search results
   */
  savedLocationFromRadius(place, i) {

    // change star class
    if (place.isSuggested) {
    } else {
      console.log("saved");
      this.zoom = 12;
      place.isSuggested = true;

      var markCount = this.markers.length + 1;

      this.locationStore.add(
        markCount + "",
        place.name || "Marker " + markCount,
        place.name || "None Set",
        place.geometry.location.lat,
        place.geometry.location.lng,
        true,
        false
      );

      console.log(this.markers);
      this.toastService.show("Added " + place.name, 2500);
    }

  }

  /*
      Reload Results based on type and radius
   */
  searchLocation(typeParam, lat, lng) {
    this.savedType.type = typeParam.type;
    this.savedType.show = typeParam.show;
    if (this.radius.length > 0) {
      this._apiService.getByRadius(this.radius, lat, lng, this.savedType.type).subscribe(
        data => {
          if (data.status === "OK") {
            this.placesResults = data.results;
          }
        },
        err => console.error(err),
        () => {
          console.log("json data", this.placesResults);
          document.getElementById("placesDiv").scrollTop = 0;
        }
      );
    }
  }

  /*
   Get the Details
   */

  detailsView(marker) {
    console.log(marker);
    this.details = marker;
  }

  saveDetailChanges(marker) {
    console.log(marker);
    this.locationStore.updateItem(marker);
    this.isEditing = false;
  }

  editDetails() {
    this.isEditing = true;
  }


}

