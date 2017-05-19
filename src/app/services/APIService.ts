import {Injectable} from '@angular/core';
import {Http, Response} from '@angular/http';
import {Observable} from 'rxjs/Rx';
@Injectable()
export class APIService {
  constructor(private http:Http) { }

  server = "https://maps.googleapis.com/maps/api/";
  key = "AIzaSyBsDLQjdZVeJfFkyQdC4BdKM5QDdvfPFuw";

  getByZipCode(zipcode) {
    return this.http.get(this.server + 'geocode/json?address=' + zipcode +  '&sensor=true').map((res:Response) => res.json());
  }

  getByLatAndLng(lat, lng) {
    return this.http.get(this.server + 'geocode/json?latlng=' + lat + ',' + lng +  '&key=' + this.key).map((res:Response) => res.json());
  }

  getByRadius(radius, lat, lng, type) {
    return this.http.get(this.server + 'place/nearbysearch/json?location=' + lat + ',' + lng + '&radius=' + radius + '&type=' + type + '&key=' + this.key).map((res:Response) => res.json());
  }

  loadPlaceTypes() {
    return this.http.get('assets/data/places-types.json').map((res:Response) => res.json());
  }

}
