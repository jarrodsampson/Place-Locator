import { BrowserModule, Title }  from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { LocationsComponent } from './locations/locations.component';
import { SettingsComponent } from './settings/settings.component';
import { ErrorComponent } from './error/error.component';

import { AgmCoreModule } from 'angular2-google-maps/core';
import { MaterializeModule } from 'ng2-materialize';
import { TruncateModule } from 'ng2-truncate';

import { RouterModule }   from '@angular/router';
import {APP_ROUTES} from './routes';

import { SearchPipe } from './pipes/searchPipe';

import { APIService } from './services/APIService';
import {LocationStore} from './services/Store';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LocationsComponent,
    SettingsComponent,
    ErrorComponent,
    SearchPipe
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyBsDLQjdZVeJfFkyQdC4BdKM5QDdvfPFuw'
    }),
    RouterModule.forRoot(APP_ROUTES),
    MaterializeModule.forRoot(),
    TruncateModule


  ],
  providers: [APIService, LocationStore, Title],
  bootstrap: [AppComponent]
})
export class AppModule { }
