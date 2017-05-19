export class Locations {

  private _id: String;
  private _title: String;
  private _description: String;
  private _lat: String;
  private _lng: String;
  private _suggested: Boolean;
  private _locked: Boolean;

  get title() {
    return this._title;
  }
  set title(value: String) {
    this._title = value.trim();
  }

  get id() {
    return this._id;
  }
  set id(value: String) {
    this._id = value;
  }

  get desc() {
    return this._description;
  }
  set desc(value: String) {
    this._description = value;
  }

  get lat() {
    return this._lat;
  }
  set lat(value: String) {
    this._lat = value;
  }

  get lng() {
    return this._lng;
  }
  set lng(value: String) {
    this._lng = value;
  }

  get suggested() {
    return this._suggested;
  }
  set suggested(value: Boolean) {
    this._suggested = value;
  }

  get locked() {
    return this._locked;
  }
  set locked(value: Boolean) {
    this._locked = value;
  }

  constructor(id: String, title: String, desc: String, lat: String, lng: String, suggested: Boolean, locked: Boolean ) {
    this.id = id;
    this.title = title.trim();
    this.desc = desc.trim();
    this.lat = lat;
    this.lng = lng;
    this.suggested = suggested;
    this.locked = locked;
  }
}

export class LocationStore {
  locations: Array<Locations>;

  constructor() {
    let persistedTodos = JSON.parse(localStorage.getItem('findPlaces') || '[]');
    // Normalize back into classes
    this.locations = persistedTodos.map( (todo: {_id: String, _title: String, _description: String, _lat: String, _lng: String, _suggested: Boolean, _locked: Boolean}) => {
      let ret = new Locations(todo._id, todo._title, todo._description, todo._lat, todo._lng, todo._suggested, todo._locked);
      return ret;
    });
  }

  private updateStore() {
    localStorage.setItem('findPlaces', JSON.stringify(this.locations));
  }

  remove(location: Locations) {
    console.log(location);
    this.locations.splice(this.locations.indexOf(location), 1);
    this.updateStore();
  }

  add(id: String, title: String, description: String, lat: String, lng: String, suggested: Boolean, locked: Boolean) {
    this.locations.push(new Locations(id, title, description, lat, lng, suggested, locked));
    console.log("Adding Location", this.locations);
    this.updateStore();
  }

  removeAll() {
    this.locations = [];
    this.updateStore();
  }

  removeAllUnlocked(markerList) {
    for (var i = this.locations.length - 1; i >= 0; --i) {
      //this.locations.splice(this.locations.findIndex(this.matchesEl), 1);
      if (this.locations[i].locked === false) {
        console.log(this.locations[i].locked);
        this.locations.splice(this.locations.indexOf(this.locations[i]), 1);
      }
    }
    this.updateStore();
  }

  updateItem(location: Locations) {
    console.log(location);
    this.locations.splice(this.locations.indexOf(location), 1, location);
    this.updateStore();
  }

}
