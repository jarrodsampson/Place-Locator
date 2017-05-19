import { Component, OnInit } from '@angular/core';
import 'rxjs/Rx';

import {LocationStore} from "../services/Store";
import { MzToastService } from 'ng2-materialize';

@Component({
  selector: 'app-root',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {


  constructor(locationStore: LocationStore, private toastService: MzToastService) {

  }


  ngOnInit() {

  }

}

