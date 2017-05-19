import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import 'rxjs/Rx';

import {LocationStore} from "../services/Store";
import { MzToastService } from 'ng2-materialize';

@Component({
  selector: 'app-root',
  templateUrl: './locations.component.html',
  styleUrls: ['./locations.component.css']
})
export class LocationsComponent implements OnInit {

  search =  {
    title: ""
  };

  details = {};
  isEditing = false;

  placeData = {
    geometry: {
      location: {
        lat: 51.678418,
        lng: 7.809007
      }
    },
    formatted_address: ""
  };
  zoom = 12; // initial zoom


  locationStore: LocationStore;
  markers = [];

  constructor(locationStore: LocationStore, private toastService: MzToastService, private titleService: Title) {
    this.titleService.setTitle( "Place Locator - Your Locations" );
    this.locationStore = locationStore;
    console.log(locationStore.locations);
  }


  ngOnInit() {


    if (localStorage.getItem('findPlaces-location')) {
      this.placeData = JSON.parse(localStorage.getItem('findPlaces-location'));
      console.log("HE", this.placeData);
    }

    /*
     get markers from local storage
     */
    this.markers = this.locationStore.locations;

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
   Erase all Markers from storage
   */
  clearAll() {
    this.markers = [];
    this.locationStore.removeAll();
    this.toastService.show("All markers have been cleared.", 2500);
  }

  /*
   Erase all Markers from storage that are not locked
   */
  clearAllUnlocked(markerList) {
    this.locationStore.removeAllUnlocked(markerList);
    this.toastService.show("All unlocked markers have been cleared.", 2500);
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
      Lock Item so it cannot be deleted
   */
  getLockItem(marker) {
    console.log(marker);
    if (marker._locked) {
      marker._locked = false;
      this.locationStore.updateItem(marker);
      this.toastService.show(marker.title + " has been unlocked.", 2500);
    } else {
      marker._locked = true;
      this.locationStore.updateItem(marker);
      this.toastService.show(marker.title + " has been locked.", 2500);
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

