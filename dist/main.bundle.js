webpackJsonp([1,4],{

/***/ 102:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_platform_browser__ = __webpack_require__(22);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ErrorComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var ErrorComponent = (function () {
    function ErrorComponent(titleService) {
        this.titleService = titleService;
        this.titleService.setTitle("Place Locator - 404 Page Not Found");
    }
    ErrorComponent.prototype.goBack = function () {
        window.history.back();
    };
    return ErrorComponent;
}());
ErrorComponent = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
        selector: 'app-root',
        template: __webpack_require__(339),
        styles: [__webpack_require__(262)]
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__angular_platform_browser__["b" /* Title */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__angular_platform_browser__["b" /* Title */]) === "function" && _a || Object])
], ErrorComponent);

var _a;
//# sourceMappingURL=error.component.js.map

/***/ }),

/***/ 103:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ng2_materialize__ = __webpack_require__(53);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__services_APIService__ = __webpack_require__(105);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__services_Store__ = __webpack_require__(45);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__angular_platform_browser__ = __webpack_require__(22);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_rxjs_Rx__ = __webpack_require__(57);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_rxjs_Rx___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_rxjs_Rx__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return HomeComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};






var HomeComponent = (function () {
    function HomeComponent(_apiService, toastService, locationStore, titleService) {
        this._apiService = _apiService;
        this.toastService = toastService;
        this.titleService = titleService;
        this.details = {};
        this.isEditing = false;
        this.search = {
            title: ""
        };
        this.place = {
            zipcode: ""
        };
        this.zoom = 12; // initial zoom
        this.placeData = {
            geometry: {
                location: {
                    lat: 51.678418,
                    lng: 7.809007
                }
            },
            formatted_address: ""
        };
        this.markers = [];
        this.markerHold = {};
        this.placesResults = [];
        this.placeDataHidden = true;
        this.placesResultsHidden = true;
        this.location = {};
        this.savedZipCode = ""; // for later comparisons
        this.savedType = {
            type: "",
            show: ""
        };
        this.radius = ""; // for later comparisons
        this.temp = {
            lat: "",
            lng: ""
        };
        this.notLoading = false;
        this.categories = [];
        this.titleService.setTitle("Place Locator - Home");
        this.locationStore = locationStore;
        console.log(locationStore.locations);
    }
    HomeComponent.prototype.ngOnInit = function () {
        var _this = this;
        /*
            get markers from local storage
        */
        this.markers = this.locationStore.locations;
        /*
            Get the local categories list for google places
         */
        this._apiService.loadPlaceTypes().subscribe(function (data) {
            _this.categories = data.data;
        }, function (err) { return console.error(err); }, function () {
            console.log("categories data", _this.categories);
        });
        /*
           Get saved location to start if not users first time, otherwise prompt
         */
        if (localStorage.getItem('findPlaces-location')) {
            this.placeData = JSON.parse(localStorage.getItem('findPlaces-location'));
            console.log("HE", this.placeData);
            this.placeDataHidden = false;
        }
        else {
            this.getLocationPrompt();
        }
    };
    /*
        Add position to map
     */
    HomeComponent.prototype.setPosition = function (position) {
        this.location = position.coords;
        console.log(position.coords);
        this.getLocationFromPrompt(this.location);
        scrollTo(0, 0);
    };
    /*
        Native Location notification box
     */
    HomeComponent.prototype.getLocationPrompt = function () {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(this.setPosition.bind(this));
        }
    };
    /*
         Get location by Zip Code
     */
    HomeComponent.prototype.getLocation = function (place) {
        //console.log(place.zipcode);
        var _this = this;
        // dont call if the zip code is the same
        if (this.savedZipCode === place.zipcode) {
            return;
        }
        this._apiService.getByZipCode(place.zipcode).subscribe(function (data) {
            if (data.status === "OK") {
                _this.placeData = data.results[0];
            }
        }, function (err) { return console.error(err); }, function () {
            console.log("json data", _this.placeData);
            _this.placeDataHidden = false;
            _this.savedZipCode = place.zipcode;
            // TODO: save location data for user's next time here, need to replace PlaceData name
        });
    };
    /*
         Get location from longitude and latitude
     */
    HomeComponent.prototype.getLocationFromPrompt = function (location) {
        var _this = this;
        this._apiService.getByLatAndLng(location.latitude, location.longitude).subscribe(function (data) {
            if (data.status === "OK") {
                _this.placesResults = data.results;
            }
        }, function (err) { return console.error(err); }, function () {
            _this.placeData = {
                geometry: {
                    location: {
                        lat: location.latitude,
                        lng: location.longitude
                    }
                },
                formatted_address: _this.placesResults[0].formatted_address
            };
            // save for next visit
            localStorage.setItem('findPlaces-location', JSON.stringify(_this.placeData));
            _this.place.zipcode = _this.placesResults[0].address_components[_this.placesResults[0].address_components.length - 1].short_name;
            _this.savedZipCode = _this.place.zipcode;
            console.log("json data", _this.placesResults);
            _this.placeDataHidden = false;
        });
    };
    /*
         Area search for your designated area
     */
    HomeComponent.prototype.viewArea = function (place, lat, lng) {
        //console.log(place.radius);
        var _this = this;
        if (this.savedType.type.length > 0) {
            if (this.savedZipCode === place.zipcode && place.radius === this.radius) {
                return;
            }
            console.log(this.savedZipCode, this.radius, this.savedType.type);
            this.notLoading = false;
            this._apiService.getByRadius(place.radius, lat, lng, this.savedType.type).subscribe(function (data) {
                if (data.status === "OK") {
                    _this.placesResults = data.results;
                }
            }, function (err) { return console.error(err); }, function () {
                console.log("json data", _this.placesResults);
                _this.placesResultsHidden = false;
                _this.notLoading = false;
                _this.radius = place.radius;
            });
        }
    };
    // markers coordinated being held until popup prompt is confirmed
    HomeComponent.prototype.mapTemp = function ($event) {
        this.temp.lat = $event.coords.lat;
        this.temp.lng = $event.coords.lng;
    };
    /*
         Save Map target
     */
    HomeComponent.prototype.mapClicked = function (marker) {
        var markCount = this.markers.length + 1;
        this.toastService.show("New Location Added", 2500);
        this.locationStore.add(markCount + "", marker.title || "Marker " + markCount, marker.desc || "None Set", this.temp.lat, this.temp.lng, false, false);
        this.markerHold = {};
    };
    HomeComponent.prototype.clickedMarker = function (label, index) {
        //console.log(`clicked the marker: ${label || index}`)
    };
    /*
      Update Marker Location
     */
    HomeComponent.prototype.markerDragEnd = function (marker, $event) {
        console.log('dragEnd', marker, $event);
        this.toastService.show(marker.title + " has been moved.", 2500);
        console.log($event.coords);
        marker._lat = $event.coords.lat;
        marker._lng = $event.coords.lng;
        this.locationStore.updateItem(marker);
    };
    /*
       Delete Single Marker
     */
    HomeComponent.prototype.delete = function (marker) {
        //this.markers.splice(i, 1);
        this.locationStore.remove(marker);
        console.log(marker);
        this.toastService.show(marker.title + " has been removed.", 2500);
    };
    /*
       On Saved Item click, take us directly to that position on the map with zoom
     */
    HomeComponent.prototype.showOnMap = function (marker) {
        console.log(marker);
        this.placeData.geometry.location.lat = marker.lat;
        this.placeData.geometry.location.lng = marker.lng;
        this.zoom = 18;
        scrollTo(0, 0);
    };
    /*
       Saved Location from search results
     */
    HomeComponent.prototype.savedLocationFromRadius = function (place, i) {
        // change star class
        if (place.isSuggested) {
        }
        else {
            console.log("saved");
            this.zoom = 12;
            place.isSuggested = true;
            var markCount = this.markers.length + 1;
            this.locationStore.add(markCount + "", place.name || "Marker " + markCount, place.name || "None Set", place.geometry.location.lat, place.geometry.location.lng, true, false);
            console.log(this.markers);
            this.toastService.show("Added " + place.name, 2500);
        }
    };
    /*
        Reload Results based on type and radius
     */
    HomeComponent.prototype.searchLocation = function (typeParam, lat, lng) {
        var _this = this;
        this.savedType.type = typeParam.type;
        this.savedType.show = typeParam.show;
        if (this.radius.length > 0) {
            this._apiService.getByRadius(this.radius, lat, lng, this.savedType.type).subscribe(function (data) {
                if (data.status === "OK") {
                    _this.placesResults = data.results;
                }
            }, function (err) { return console.error(err); }, function () {
                console.log("json data", _this.placesResults);
                document.getElementById("placesDiv").scrollTop = 0;
            });
        }
    };
    /*
     Get the Details
     */
    HomeComponent.prototype.detailsView = function (marker) {
        console.log(marker);
        this.details = marker;
    };
    HomeComponent.prototype.saveDetailChanges = function (marker) {
        console.log(marker);
        this.locationStore.updateItem(marker);
        this.isEditing = false;
    };
    HomeComponent.prototype.editDetails = function () {
        this.isEditing = true;
    };
    return HomeComponent;
}());
HomeComponent = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
        selector: 'app-root',
        template: __webpack_require__(340),
        styles: [__webpack_require__(263)]
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_2__services_APIService__["a" /* APIService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_2__services_APIService__["a" /* APIService */]) === "function" && _a || Object, typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_1_ng2_materialize__["b" /* MzToastService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1_ng2_materialize__["b" /* MzToastService */]) === "function" && _b || Object, typeof (_c = typeof __WEBPACK_IMPORTED_MODULE_3__services_Store__["a" /* LocationStore */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_3__services_Store__["a" /* LocationStore */]) === "function" && _c || Object, typeof (_d = typeof __WEBPACK_IMPORTED_MODULE_4__angular_platform_browser__["b" /* Title */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_4__angular_platform_browser__["b" /* Title */]) === "function" && _d || Object])
], HomeComponent);

var _a, _b, _c, _d;
//# sourceMappingURL=home.component.js.map

/***/ }),

/***/ 104:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_platform_browser__ = __webpack_require__(22);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_Rx__ = __webpack_require__(57);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_Rx___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_rxjs_Rx__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__services_Store__ = __webpack_require__(45);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_ng2_materialize__ = __webpack_require__(53);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return LocationsComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





var LocationsComponent = (function () {
    function LocationsComponent(locationStore, toastService, titleService) {
        this.toastService = toastService;
        this.titleService = titleService;
        this.search = {
            title: ""
        };
        this.details = {};
        this.isEditing = false;
        this.placeData = {
            geometry: {
                location: {
                    lat: 51.678418,
                    lng: 7.809007
                }
            },
            formatted_address: ""
        };
        this.zoom = 12; // initial zoom
        this.markers = [];
        this.titleService.setTitle("Place Locator - Your Locations");
        this.locationStore = locationStore;
        console.log(locationStore.locations);
    }
    LocationsComponent.prototype.ngOnInit = function () {
        if (localStorage.getItem('findPlaces-location')) {
            this.placeData = JSON.parse(localStorage.getItem('findPlaces-location'));
            console.log("HE", this.placeData);
        }
        /*
         get markers from local storage
         */
        this.markers = this.locationStore.locations;
    };
    /*
     On Saved Item click, take us directly to that position on the map with zoom
     */
    LocationsComponent.prototype.showOnMap = function (marker) {
        console.log(marker);
        this.placeData.geometry.location.lat = marker.lat;
        this.placeData.geometry.location.lng = marker.lng;
        this.zoom = 18;
        scrollTo(0, 0);
    };
    /*
     Erase all Markers from storage
     */
    LocationsComponent.prototype.clearAll = function () {
        this.markers = [];
        this.locationStore.removeAll();
        this.toastService.show("All markers have been cleared.", 2500);
    };
    /*
     Erase all Markers from storage that are not locked
     */
    LocationsComponent.prototype.clearAllUnlocked = function (markerList) {
        this.locationStore.removeAllUnlocked(markerList);
        this.toastService.show("All unlocked markers have been cleared.", 2500);
    };
    /*
     Update Marker Location
     */
    LocationsComponent.prototype.markerDragEnd = function (marker, $event) {
        console.log('dragEnd', marker, $event);
        this.toastService.show(marker.title + " has been moved.", 2500);
        console.log($event.coords);
        marker._lat = $event.coords.lat;
        marker._lng = $event.coords.lng;
        this.locationStore.updateItem(marker);
    };
    /*
     Delete Single Marker
     */
    LocationsComponent.prototype.delete = function (marker) {
        //this.markers.splice(i, 1);
        this.locationStore.remove(marker);
        console.log(marker);
        this.toastService.show(marker.title + " has been removed.", 2500);
    };
    /*
        Lock Item so it cannot be deleted
     */
    LocationsComponent.prototype.getLockItem = function (marker) {
        console.log(marker);
        if (marker._locked) {
            marker._locked = false;
            this.locationStore.updateItem(marker);
            this.toastService.show(marker.title + " has been unlocked.", 2500);
        }
        else {
            marker._locked = true;
            this.locationStore.updateItem(marker);
            this.toastService.show(marker.title + " has been locked.", 2500);
        }
    };
    /*
     Get the Details
     */
    LocationsComponent.prototype.detailsView = function (marker) {
        console.log(marker);
        this.details = marker;
    };
    LocationsComponent.prototype.saveDetailChanges = function (marker) {
        console.log(marker);
        this.locationStore.updateItem(marker);
        this.isEditing = false;
    };
    LocationsComponent.prototype.editDetails = function () {
        this.isEditing = true;
    };
    return LocationsComponent;
}());
LocationsComponent = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
        selector: 'app-root',
        template: __webpack_require__(341),
        styles: [__webpack_require__(264)]
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_3__services_Store__["a" /* LocationStore */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_3__services_Store__["a" /* LocationStore */]) === "function" && _a || Object, typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_4_ng2_materialize__["b" /* MzToastService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_4_ng2_materialize__["b" /* MzToastService */]) === "function" && _b || Object, typeof (_c = typeof __WEBPACK_IMPORTED_MODULE_1__angular_platform_browser__["b" /* Title */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__angular_platform_browser__["b" /* Title */]) === "function" && _c || Object])
], LocationsComponent);

var _a, _b, _c;
//# sourceMappingURL=locations.component.js.map

/***/ }),

/***/ 105:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_http__ = __webpack_require__(101);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return APIService; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var APIService = (function () {
    function APIService(http) {
        this.http = http;
        this.server = "https://maps.googleapis.com/maps/api/";
        this.key = "AIzaSyBsDLQjdZVeJfFkyQdC4BdKM5QDdvfPFuw";
    }
    APIService.prototype.getByZipCode = function (zipcode) {
        return this.http.get(this.server + 'geocode/json?address=' + zipcode + '&sensor=true').map(function (res) { return res.json(); });
    };
    APIService.prototype.getByLatAndLng = function (lat, lng) {
        return this.http.get(this.server + 'geocode/json?latlng=' + lat + ',' + lng + '&key=' + this.key).map(function (res) { return res.json(); });
    };
    APIService.prototype.getByRadius = function (radius, lat, lng, type) {
        return this.http.get(this.server + 'place/nearbysearch/json?location=' + lat + ',' + lng + '&radius=' + radius + '&type=' + type + '&key=' + this.key).map(function (res) { return res.json(); });
    };
    APIService.prototype.loadPlaceTypes = function () {
        return this.http.get('assets/data/places-types.json').map(function (res) { return res.json(); });
    };
    return APIService;
}());
APIService = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(),
    __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__angular_http__["b" /* Http */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__angular_http__["b" /* Http */]) === "function" && _a || Object])
], APIService);

var _a;
//# sourceMappingURL=APIService.js.map

/***/ }),

/***/ 106:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rxjs_Rx__ = __webpack_require__(57);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rxjs_Rx___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_rxjs_Rx__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__services_Store__ = __webpack_require__(45);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_ng2_materialize__ = __webpack_require__(53);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SettingsComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var SettingsComponent = (function () {
    function SettingsComponent(locationStore, toastService) {
        this.toastService = toastService;
    }
    SettingsComponent.prototype.ngOnInit = function () {
    };
    return SettingsComponent;
}());
SettingsComponent = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
        selector: 'app-root',
        template: __webpack_require__(342),
        styles: [__webpack_require__(265)]
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_2__services_Store__["a" /* LocationStore */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_2__services_Store__["a" /* LocationStore */]) === "function" && _a || Object, typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_3_ng2_materialize__["b" /* MzToastService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_3_ng2_materialize__["b" /* MzToastService */]) === "function" && _b || Object])
], SettingsComponent);

var _a, _b;
//# sourceMappingURL=settings.component.js.map

/***/ }),

/***/ 190:
/***/ (function(module, exports) {

function webpackEmptyContext(req) {
	throw new Error("Cannot find module '" + req + "'.");
}
webpackEmptyContext.keys = function() { return []; };
webpackEmptyContext.resolve = webpackEmptyContext;
module.exports = webpackEmptyContext;
webpackEmptyContext.id = 190;


/***/ }),

/***/ 191:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_platform_browser_dynamic__ = __webpack_require__(196);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__app_app_module__ = __webpack_require__(199);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__environments_environment__ = __webpack_require__(202);




if (__WEBPACK_IMPORTED_MODULE_3__environments_environment__["a" /* environment */].production) {
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["enableProdMode"])();
}
__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__angular_platform_browser_dynamic__["a" /* platformBrowserDynamic */])().bootstrapModule(__WEBPACK_IMPORTED_MODULE_2__app_app_module__["a" /* AppModule */]);
//# sourceMappingURL=main.js.map

/***/ }),

/***/ 198:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rxjs_Rx__ = __webpack_require__(57);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rxjs_Rx___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_rxjs_Rx__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};


var AppComponent = (function () {
    function AppComponent() {
    }
    return AppComponent;
}());
AppComponent = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
        selector: 'app-root',
        template: __webpack_require__(338),
        styles: [__webpack_require__(261)]
    })
], AppComponent);

//# sourceMappingURL=app.component.js.map

/***/ }),

/***/ 199:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser__ = __webpack_require__(22);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_forms__ = __webpack_require__(195);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__angular_http__ = __webpack_require__(101);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__app_component__ = __webpack_require__(198);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__home_home_component__ = __webpack_require__(103);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__locations_locations_component__ = __webpack_require__(104);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__settings_settings_component__ = __webpack_require__(106);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__error_error_component__ = __webpack_require__(102);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9_angular2_google_maps_core__ = __webpack_require__(205);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9_angular2_google_maps_core___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_9_angular2_google_maps_core__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10_ng2_materialize__ = __webpack_require__(53);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11_ng2_truncate__ = __webpack_require__(333);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__angular_router__ = __webpack_require__(197);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__routes__ = __webpack_require__(201);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__pipes_searchPipe__ = __webpack_require__(200);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15__services_APIService__ = __webpack_require__(105);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_16__services_Store__ = __webpack_require__(45);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppModule; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};

















var AppModule = (function () {
    function AppModule() {
    }
    return AppModule;
}());
AppModule = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__angular_core__["NgModule"])({
        declarations: [
            __WEBPACK_IMPORTED_MODULE_4__app_component__["a" /* AppComponent */],
            __WEBPACK_IMPORTED_MODULE_5__home_home_component__["a" /* HomeComponent */],
            __WEBPACK_IMPORTED_MODULE_6__locations_locations_component__["a" /* LocationsComponent */],
            __WEBPACK_IMPORTED_MODULE_7__settings_settings_component__["a" /* SettingsComponent */],
            __WEBPACK_IMPORTED_MODULE_8__error_error_component__["a" /* ErrorComponent */],
            __WEBPACK_IMPORTED_MODULE_14__pipes_searchPipe__["a" /* SearchPipe */]
        ],
        imports: [
            __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser__["a" /* BrowserModule */],
            __WEBPACK_IMPORTED_MODULE_2__angular_forms__["a" /* FormsModule */],
            __WEBPACK_IMPORTED_MODULE_3__angular_http__["a" /* HttpModule */],
            __WEBPACK_IMPORTED_MODULE_9_angular2_google_maps_core__["AgmCoreModule"].forRoot({
                apiKey: 'AIzaSyBsDLQjdZVeJfFkyQdC4BdKM5QDdvfPFuw'
            }),
            __WEBPACK_IMPORTED_MODULE_12__angular_router__["a" /* RouterModule */].forRoot(__WEBPACK_IMPORTED_MODULE_13__routes__["a" /* APP_ROUTES */]),
            __WEBPACK_IMPORTED_MODULE_10_ng2_materialize__["a" /* MaterializeModule */].forRoot(),
            __WEBPACK_IMPORTED_MODULE_11_ng2_truncate__["a" /* TruncateModule */]
        ],
        providers: [__WEBPACK_IMPORTED_MODULE_15__services_APIService__["a" /* APIService */], __WEBPACK_IMPORTED_MODULE_16__services_Store__["a" /* LocationStore */], __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser__["b" /* Title */]],
        bootstrap: [__WEBPACK_IMPORTED_MODULE_4__app_component__["a" /* AppComponent */]]
    })
], AppModule);

//# sourceMappingURL=app.module.js.map

/***/ }),

/***/ 200:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SearchPipe; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};

var SearchPipe = (function () {
    function SearchPipe() {
    }
    SearchPipe.prototype.transform = function (items, filter) {
        if (!items || !filter) {
            return items;
        }
        // filter items array, items which match and return true will be kept, false will be filtered out
        return items.filter(function (item) { return item.title.toLowerCase().indexOf(filter['title'].toLowerCase()) !== -1; });
    };
    return SearchPipe;
}());
SearchPipe = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Pipe"])({
        name: 'searchFilter',
        pure: false
    })
], SearchPipe);

//# sourceMappingURL=searchPipe.js.map

/***/ }),

/***/ 201:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__home_home_component__ = __webpack_require__(103);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__locations_locations_component__ = __webpack_require__(104);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__settings_settings_component__ = __webpack_require__(106);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__error_error_component__ = __webpack_require__(102);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return APP_ROUTES; });




var APP_ROUTES = [
    {
        path: 'home',
        component: __WEBPACK_IMPORTED_MODULE_0__home_home_component__["a" /* HomeComponent */],
        pathMatch: 'full'
    },
    {
        path: 'locations',
        component: __WEBPACK_IMPORTED_MODULE_1__locations_locations_component__["a" /* LocationsComponent */],
        pathMatch: 'full'
    },
    {
        path: 'settings',
        component: __WEBPACK_IMPORTED_MODULE_2__settings_settings_component__["a" /* SettingsComponent */],
        pathMatch: 'full'
    },
    {
        path: '',
        redirectTo: '/home',
        pathMatch: 'full'
    },
    {
        path: 'error404',
        component: __WEBPACK_IMPORTED_MODULE_3__error_error_component__["a" /* ErrorComponent */],
        pathMatch: 'full'
    },
    {
        path: '**',
        redirectTo: '/error404'
    }
];
//# sourceMappingURL=routes.js.map

/***/ }),

/***/ 202:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return environment; });
// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.
// The file contents for the current environment will overwrite these during build.
var environment = {
    production: true
};
//# sourceMappingURL=environment.js.map

/***/ }),

/***/ 261:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(29)();
// imports


// module
exports.push([module.i, "", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ 262:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(29)();
// imports


// module
exports.push([module.i, ".boxError {\n  position: absolute;\n  top: 50%;\n  left: 50%;\n  width: 600px;\n  margin-left: -300px;\n  height: 350px;\n  margin-top: -185px;\n  background: rgba(255,255,255,0.7);\n  border-radius: 10px;\n}\n\n\n.backBg {\n  background: url(" + __webpack_require__(603) + ") #000;\n  width:100%;\n  height:100%;\n  position:fixed;\n  top:0;\n  left:0;\n  z-index:-1;\n}\n", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ 263:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(29)();
// imports


// module
exports.push([module.i, ".sebm-google-map-container {\n  height: 600px;\n}\n\n\n.map {\n  width: 100%;\n  height: 100%;\n  position: absolute;\n  top: 0;\n  right: 0;\n}\n\n.mapContainer {\n  position: relative;\n  height: 100vh;\n  max-height: 600px;\n}\n\n.placesDiv {\n  max-height:269px;\n  overflow-y:scroll;\n  overflow-x:hidden;\n}\n\n.placesListItem {\n  position:relative;\n}\n\n.padding {\n  padding: 0 1em 1em 1em;\n}\n\n.saveStar {\n  position: absolute;\n  right: 0;\n  top: 0;\n  cursor: pointer;\n  color: rgba(0,0,0,0.5);\n}\n\n.starred {\n  color:#ffc107;\n}\n\n.imagery {\n  max-width: 22px;\n  position: absolute;\n  right: 2em;\n  top:0;\n}\n\n\n.placesDiv p {\n  max-width:300px;\n}\n\n.tagItem {\n  font-size:8pt;\n  padding:0 0.5em 0 0;\n}\n\n\n@media(max-width:992px) {\n  .panel {\n    max-width:750px;\n    min-width:350px;\n    background:#ecf0f1;\n    position:relative;\n    top:0;\n    left:0;\n    max-height:400px;\n    height:auto;\n    z-index:1;\n    width:100%;\n    padding:1em;\n    overflow-y:scroll;\n    margin-top: 0;\n    resize:none;\n    box-shadow: 1px 1px 50px 1px #000;\n  }\n\n  .map {\n    height:400px;\n    width: 100%;\n    position: relative;\n    top: 0;\n    right: 0;\n  }\n\n  .padding {\n    padding: 0;\n  }\n}\n", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ 264:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(29)();
// imports


// module
exports.push([module.i, ".sebm-google-map-container {\n  height: 100%;\n}\n\n\n.map {\n  width: 100%;\n  height: 700px;\n  top: 0;\n  right: 0;\n  z-index:0;\n  margin:0;\n  padding:0;\n}\n\n.mapContainer {\n  overflow:hidden;\n}\n\n\n.panel {\n  max-width:750px;\n  min-width:350px;\n  background:#ecf0f1;\n  position:absolute;\n  top:0;\n  left:0;\n  height:704px;\n  z-index:1;\n  width:450px;\n  padding:1em;\n  overflow-y:scroll;\n  margin-top: 4em;\n  resize:horizontal;\n  box-shadow: 1px 1px 50px 1px #000;\n}\n\n.panel .card .card-content {\n  min-height: 0;\n}\n\n.markerListData {\n  margin-top: 1em;\n}\n\ni {\n  color: #5e35b1;\n  cursor:pointer;\n}\n\n.navigation {\n  text-align: center;\n  position: relative;\n}\n\n.eraser {\n  position: absolute;\n  top: 0;\n  right: 0;\n}\n\n.lockSection {\n  position: absolute;\n  right:1.5em;\n}\n\n.lockSection:hover {\n}\n\ni {\n  transition: all 1s ease-in-out;\n  -webkit-transition: all 1s ease-in-out;\n  -moz-transition: all 1s ease-in-out;\n}\n\ni:hover {\n  color:green;\n  -webkit-animation: tada 1s ;\n  animation: tada 1s;\n}\n\n.sliceTitle {\n  max-width: 90%;\n}\n\n.padding {\n  padding: 0 1em 1em 1em;\n}\n\n.pull-up {\n  margin-top: -2em;\n}\n\n\n@media(max-width:992px) {\n  .panel {\n    max-width:100%;\n    min-width:350px;\n    background:#ecf0f1;\n    position:relative;\n    top:0;\n    left:0;\n    max-height:400px;\n    height:auto;\n    z-index:1;\n    width:100%;\n    padding:1em;\n    overflow-y:scroll;\n    margin-top: 0;\n    resize:none;\n    box-shadow: 1px 1px 50px 1px #000;\n  }\n\n  .map {\n    height:400px;\n    width: 100%;\n    position: relative;\n    top: 0;\n    right: 0;\n  }\n\n  .padding[_ngcontent-c1] {\n    padding: 0;\n  }\n}\n\n", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ 265:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(29)();
// imports


// module
exports.push([module.i, "", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ 338:
/***/ (function(module, exports) {

module.exports = "<router-outlet></router-outlet>\n"

/***/ }),

/***/ 339:
/***/ (function(module, exports) {

module.exports = "<div class=\"backBg\"></div>\n  <div class=\"row center-align boxError\">\n\n    <div class=\"col s12\">\n      <h1>404</h1>\n      <h2>Page Not Found</h2>\n    </div>\n\n\n    <div class=\"col s12\">\n      <p>The Requested Page that you are looking is currently unavailable or does not exist. Please try again later.</p>\n    </div>\n\n\n    <div class=\"col s12\">\n      <button (click)=\"goBack()\" class=\"waves-effect waves-light btn deep-purple darken-1\">Go Back</button>\n    </div>\n\n  </div>\n"

/***/ }),

/***/ 340:
/***/ (function(module, exports) {

module.exports = "\n<div class=\"\">\n\n  <div class=\"row\">\n    <div class=\"col s12 m4 l4\">\n      <div class=\"padding\">\n        <div class=\"\">\n          <h4>Locate By Zip</h4>\n          <p>\n            <input type=\"text\" [(ngModel)]=\"place.zipcode\" placeholder=\"Zip Code\" (keyup.enter)=\"getLocation(place)\" (blur)=\"getLocation(place)\" maxlength=\"5\" />\n            <br />\n            <span [hidden]=\"placeDataHidden\">Place: {{placeData.formatted_address}}</span>\n          </p>\n        </div>\n\n        <div [hidden]=\"placeDataHidden\">\n          <p>See what's around you.</p>\n\n          <mz-dropdown\n            [id]=\"'categories-drop'\"\n            [align]=\"'left'\"\n            [constrainWidth]=\"false\"\n            [dropdownButtonId]=\"'categories'\"\n            [gutter]=\"true\"\n            [hover]=\"true\"\n            [inDuration]=\"300\"\n            [outDuration]=\"300\"\n            [stopPropagation]=\"true\">\n\n            <mz-dropdown-item *ngFor=\"let choice of categories; let i = index\">\n              <a (click)=\"searchLocation(choice, placeData.geometry.location.lat, placeData.geometry.location.lng)\">{{choice.show}}</a>\n            </mz-dropdown-item>\n\n          </mz-dropdown>\n\n            <p>\n              <a mz-button id=\"categories\" href=\"#\" class=\"deep-purple darken-1\">Category</a> - {{savedType.show || \"None\"}}\n            </p>\n\n          <input type=\"text\" maxlength=\"5\" placeholder=\"Enter Radius (Meters)\" [(ngModel)]=\"place.radius\" (keyup.enter)=\"viewArea(place, placeData.geometry.location.lat, placeData.geometry.location.lng)\" (blur)=\"viewArea(place, placeData.geometry.location.lat, placeData.geometry.location.lng)\" />\n        </div>\n\n        <div [hidden]=\"placesResultsHidden\" class=\"placesDiv\" id=\"placesDiv\">\n          <!--<div [hidden]=\"notLoading\" class=\"InLoader\">\n            <p>Loading...</p>\n          </div> -->\n          <div *ngFor=\"let placeItem of placesResults; let i = index\" class=\"placesListItem\">\n            <p>\n              <strong>{{placeItem.name}}\n                <img class=\"imagery\" src=\"{{placeItem.icon}}\" alt=\"{{placeItem.name}}\" />\n                <i class=\"material-icons saveStar\"\n                   (click)=\"savedLocationFromRadius(placeItem, i)\"\n                   [ngClass]=\"{ 'starred': placeItem.isSuggested == true }\">grade</i>\n              </strong>\n            </p>\n            <p>{{placeItem.vicinity}}</p>\n            <p>\n              <span class=\"tagItem\" *ngFor=\"let tag of placeItem.types\"><em>{{tag}}</em></span>\n            </p>\n          </div>\n\n          <div *ngIf=\"placesResults.length <= 0\">\n            <p>No Results Found.</p>\n          </div>\n\n        </div>\n\n      </div>\n\n    </div>\n    <!-- (mapClick)=\"mapClicked($event)\"-->\n    <!--\n\n    <sebm-google-map-marker\n          [latitude]=\"placeData.geometry.location.lat\"\n          [longitude]=\"placeData.geometry.location.lng\"\n          [markerDraggable]=\"true\">\n        </sebm-google-map-marker>\n\n        -->\n\n    <div class=\"col s12 m8 l8 mapContainer\">\n      <sebm-google-map class=\"map\"\n        [latitude]=\"placeData.geometry.location.lat\"\n        [longitude]=\"placeData.geometry.location.lng\"\n        [zoom]=\"zoom\"\n        [draggable]=\"false\"\n        (mapClick)=\"addModal.open(); mapTemp($event)\">\n\n        <sebm-google-map-marker\n          *ngFor=\"let m of markers | searchFilter:search; let i = index\"\n          (markerClick)=\"clickedMarker(m.label, i)\"\n          [latitude]=\"m.lat\"\n          [longitude]=\"m.lng\"\n          [label]=\"m.number\"\n          [markerDraggable]=\"true\"\n          [title]=\"m.title\"\n          (dragEnd)=\"markerDragEnd(m, $event)\">\n\n          <sebm-google-map-info-window>\n            <strong>{{m._description}}</strong>\n          </sebm-google-map-info-window>\n\n        </sebm-google-map-marker>\n\n      </sebm-google-map>\n    </div>\n  </div>\n</div>\n\n\n<div class=\"padding pull-up\">\n\n  <div class=\"row\">\n    <div class=\"col s12\">\n      <div>\n        <p *ngIf=\"(markers | searchFilter:search).length > 1\">{{(markers | searchFilter:search).length}} Total Markers Found.</p>\n        <p *ngIf=\"(markers | searchFilter:search).length === 1\">{{(markers | searchFilter:search).length}} Marker Found.</p>\n        <p *ngIf=\"(markers | searchFilter:search).length <= 0\">No Markers found.</p>\n      </div>\n\n      <div>\n        <input class=\"topRepoInput\" type=\"text\" [(ngModel)]=\"search.title\" placeholder=\"Search Markers...\"/>\n      </div>\n\n    </div>\n\n    <div class=\"\">\n      <div class=\"markerListData\">\n        <div class=\"col s12 m4 l3\" *ngFor=\"let m of (markers | searchFilter:search); let i = index\">\n          <div class=\"card hoverable left-align\">\n            <div class=\"card-content\">\n              <span class=\"card-title truncate\" (click)=\"showOnMap(m)\">{{m.title}}</span>\n              <p class=\"\" [innerHTML]=\"m._description | truncate : 100\"></p>\n              <!--<p>{{m.lat}} {{m.lng}}</p>-->\n            </div>\n            <div class=\"card-action\">\n              <a (click)=\"detailsModal.open();detailsView(m)\">Details</a>\n              <div class=\"plus\">\n                <a (click)=\"showOnMap(m)\" ><i class=\"material-icons\">location_on</i></a>\n                <a (click)=\"delete(m)\"><i class=\"material-icons\">delete</i></a>\n              </div>\n            </div>\n          </div>\n        </div>\n\n        <div class=\"col s12 noResults\" *ngIf=\"(markers | searchFilter:search).length === 0\">\n          <p>No results found.</p>\n        </div>\n\n      </div>\n    </div>\n\n  </div>\n\n</div>\n\n\n<mz-modal #addModal [fixedFooter]=\"false\">\n  <mz-modal-header>\n    Add a New Pin\n  </mz-modal-header>\n  <mz-modal-content>\n    Please Fill Out the Information Below to add this pin.\n    <input type=\"text\" placeholder=\"Name of Pin\" [(ngModel)]=\"markerHold.title\" />\n    <textarea class=\"materialize-textarea\" [(ngModel)]=\"markerHold.desc\" placeholder=\"Description\"></textarea>\n  </mz-modal-content>\n  <mz-modal-footer>\n    <button mz-button [flat]=\"true\" mz-modal-close>Cancel</button>\n    <button mz-button [flat]=\"true\" mz-modal-close (click)=\"mapClicked(markerHold)\">Add Pin</button>\n  </mz-modal-footer>\n</mz-modal>\n\n\n<mz-modal #detailsModal [fixedFooter]=\"false\">\n  <mz-modal-header>\n    <h4 [hidden]=\"isEditing\" (mouseover)=\"editDetails()\">{{details.title}}</h4>\n    <input [hidden]=\"!isEditing\" (mouseout)=\"saveDetailChanges(details)\" type=\"text\" placeholder=\"Title\" [(ngModel)]=\"details.title\" />\n  </mz-modal-header>\n  <mz-modal-content>\n    <p [hidden]=\"isEditing\" (mouseover)=\"editDetails()\"><i class=\"material-icons\">edit</i> {{details._description}}</p>\n    <textarea [hidden]=\"!isEditing\" class=\"materialize-textarea\" [(ngModel)]=\"details._description\" (mouseout)=\"saveDetailChanges(details)\" placeholder=\"Description\"></textarea>\n  </mz-modal-content>\n  <mz-modal-footer>\n    <button mz-button [flat]=\"true\" mz-modal-close (click)=\"showOnMap(details)\"><i class=\"material-icons\">location_on</i></button>\n    <button mz-button [flat]=\"true\" mz-modal-close (click)=\"delete(details)\"><i class=\"material-icons\">delete</i></button>\n    <button mz-button [flat]=\"true\" mz-modal-close>Close</button>\n  </mz-modal-footer>\n</mz-modal>\n"

/***/ }),

/***/ 341:
/***/ (function(module, exports) {

module.exports = "\n<div class=\"\">\n\n  <div class=\"\">\n\n    <div class=\"panel\">\n      <div *ngIf=\"markers.length > 0\" class=\"navigation\">\n        <strong>\n          <p *ngIf=\"markers.length > 1\">{{markers.length}} Markers Found.</p>\n          <p *ngIf=\"markers.length === 1\">{{markers.length}} Marker Found.</p>\n          <p *ngIf=\"markers.length <= 0\">No Markers found.</p>\n        </strong>\n        <a (click)=\"clearAllModal.open()\"><i class=\"material-icons eraser\">refresh</i></a>\n\n        <div>\n          <input class=\"topRepoInput\" type=\"text\" [(ngModel)]=\"search.title\" placeholder=\"Search Markers...\"/>\n        </div>\n      </div>\n      <div class=\"markerListData\">\n        <div class=\"col s12 m4 l3\" *ngFor=\"let m of (markers | searchFilter:search); let i = index\">\n          <div class=\"card hoverable left-align\">\n            <div class=\"card-content\">\n\n              <div (click)=\"getLockItem(m)\" class=\"lockSection\">\n                <a [hidden]=\"m._locked\"><i class=\"material-icons\">lock_open</i></a>\n                <a [hidden]=\"!m._locked\"><i class=\"material-icons\">lock</i></a>\n              </div>\n              <span class=\"card-title truncate sliceTitle\" (click)=\"showOnMap(m)\">{{m.title}}</span>\n              <p class=\"\" [innerHTML]=\"m._description | truncate : 100\"></p>\n              <!--<p>{{m.lat}} {{m.lng}}</p>-->\n            </div>\n            <div class=\"card-action\">\n              <a (click)=\"detailsModal.open();detailsView(m)\">Details</a>\n              <div class=\"plus\">\n                <a (click)=\"showOnMap(m)\" ><i class=\"material-icons\">location_on</i></a>\n                <a (click)=\"delete(i, m)\"><i class=\"material-icons\">delete</i></a>\n              </div>\n            </div>\n          </div>\n        </div>\n\n        <div class=\"col s12 noResults\" *ngIf=\"(markers | searchFilter:search).length === 0\">\n          <p>No results found.</p>\n        </div>\n      </div>\n    </div>\n\n    <div class=\"col s12 m12 l12 mapContainer\">\n      <sebm-google-map class=\"map\"\n                       [latitude]=\"placeData.geometry.location.lat\"\n                       [longitude]=\"placeData.geometry.location.lng\"\n                       [zoom]=\"zoom\"\n                       [draggable]=\"false\">\n\n\n        <sebm-google-map-marker\n          *ngFor=\"let m of markers | searchFilter:search; let i = index\"\n          [latitude]=\"m.lat\"\n          [longitude]=\"m.lng\"\n          [label]=\"m._number\"\n          [markerDraggable]=\"true\"\n          [title]=\"m.title\"\n          (dragEnd)=\"markerDragEnd(m, $event)\">\n\n          <sebm-google-map-info-window>\n            <strong>{{m._description}}</strong>\n          </sebm-google-map-info-window>\n\n        </sebm-google-map-marker>\n\n      </sebm-google-map>\n    </div>\n\n  </div>\n</div>\n\n\n<mz-modal #clearAllModal [fixedFooter]=\"false\">\n  <mz-modal-header>\n    Clear all unlocked Pins?\n  </mz-modal-header>\n  <mz-modal-content>\n    This cannot be undone. Continue? Your Locked Pins will not be deleted.\n  </mz-modal-content>\n  <mz-modal-footer>\n    <button mz-button [flat]=\"true\" mz-modal-close>Cancel</button>\n    <button mz-button [flat]=\"true\" mz-modal-close (click)=\"clearAllUnlocked(markers)\">Purge</button>\n  </mz-modal-footer>\n</mz-modal>\n\n\n<mz-modal #detailsModal [fixedFooter]=\"false\">\n  <mz-modal-header>\n    <h4 [hidden]=\"isEditing\" (mouseover)=\"editDetails()\">{{details.title}}</h4>\n    <input [hidden]=\"!isEditing\" (mouseout)=\"saveDetailChanges(details)\" type=\"text\" placeholder=\"Title\" [(ngModel)]=\"details.title\" />\n  </mz-modal-header>\n  <mz-modal-content>\n    <p [hidden]=\"isEditing\" (mouseover)=\"editDetails()\"><i class=\"material-icons\">edit</i> {{details._description}}</p>\n    <textarea [hidden]=\"!isEditing\" class=\"materialize-textarea\" [(ngModel)]=\"details._description\" (mouseout)=\"saveDetailChanges(details)\" placeholder=\"Description\"></textarea>\n  </mz-modal-content>\n  <mz-modal-footer>\n    <button mz-button [flat]=\"true\" mz-modal-close (click)=\"showOnMap(details)\"><i class=\"material-icons\">location_on</i></button>\n    <button mz-button [flat]=\"true\" mz-modal-close (click)=\"delete(details)\"><i class=\"material-icons\">delete</i></button>\n    <button mz-button [flat]=\"true\" mz-modal-close>Close</button>\n  </mz-modal-footer>\n</mz-modal>\n"

/***/ }),

/***/ 342:
/***/ (function(module, exports) {

module.exports = ""

/***/ }),

/***/ 45:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export Locations */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return LocationStore; });
var Locations = (function () {
    function Locations(id, title, desc, lat, lng, suggested, locked) {
        this.id = id;
        this.title = title.trim();
        this.desc = desc.trim();
        this.lat = lat;
        this.lng = lng;
        this.suggested = suggested;
        this.locked = locked;
    }
    Object.defineProperty(Locations.prototype, "title", {
        get: function () {
            return this._title;
        },
        set: function (value) {
            this._title = value.trim();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Locations.prototype, "id", {
        get: function () {
            return this._id;
        },
        set: function (value) {
            this._id = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Locations.prototype, "desc", {
        get: function () {
            return this._description;
        },
        set: function (value) {
            this._description = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Locations.prototype, "lat", {
        get: function () {
            return this._lat;
        },
        set: function (value) {
            this._lat = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Locations.prototype, "lng", {
        get: function () {
            return this._lng;
        },
        set: function (value) {
            this._lng = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Locations.prototype, "suggested", {
        get: function () {
            return this._suggested;
        },
        set: function (value) {
            this._suggested = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Locations.prototype, "locked", {
        get: function () {
            return this._locked;
        },
        set: function (value) {
            this._locked = value;
        },
        enumerable: true,
        configurable: true
    });
    return Locations;
}());

var LocationStore = (function () {
    function LocationStore() {
        var persistedTodos = JSON.parse(localStorage.getItem('findPlaces') || '[]');
        // Normalize back into classes
        this.locations = persistedTodos.map(function (todo) {
            var ret = new Locations(todo._id, todo._title, todo._description, todo._lat, todo._lng, todo._suggested, todo._locked);
            return ret;
        });
    }
    LocationStore.prototype.updateStore = function () {
        localStorage.setItem('findPlaces', JSON.stringify(this.locations));
    };
    LocationStore.prototype.remove = function (location) {
        console.log(location);
        this.locations.splice(this.locations.indexOf(location), 1);
        this.updateStore();
    };
    LocationStore.prototype.add = function (id, title, description, lat, lng, suggested, locked) {
        this.locations.push(new Locations(id, title, description, lat, lng, suggested, locked));
        console.log("Adding Location", this.locations);
        this.updateStore();
    };
    LocationStore.prototype.removeAll = function () {
        this.locations = [];
        this.updateStore();
    };
    LocationStore.prototype.removeAllUnlocked = function (markerList) {
        for (var i = this.locations.length - 1; i >= 0; --i) {
            //this.locations.splice(this.locations.findIndex(this.matchesEl), 1);
            if (this.locations[i].locked === false) {
                console.log(this.locations[i].locked);
                this.locations.splice(this.locations.indexOf(this.locations[i]), 1);
            }
        }
        this.updateStore();
    };
    LocationStore.prototype.updateItem = function (location) {
        console.log(location);
        this.locations.splice(this.locations.indexOf(location), 1, location);
        this.updateStore();
    };
    return LocationStore;
}());

//# sourceMappingURL=Store.js.map

/***/ }),

/***/ 603:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "wall.29b33a8bbaf9fa7ce7d4.jpg";

/***/ }),

/***/ 605:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(191);


/***/ })

},[605]);
//# sourceMappingURL=main.bundle.js.map