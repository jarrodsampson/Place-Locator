import { HomeComponent } from './home/home.component';
import { LocationsComponent } from './locations/locations.component';
import { SettingsComponent } from './settings/settings.component';
import { ErrorComponent } from './error/error.component';

export const APP_ROUTES = [
  {
    path: 'home',
    component: HomeComponent,
    pathMatch: 'full'
  },
  {
    path: 'locations',
    component: LocationsComponent,
    pathMatch: 'full'
  },
  {
    path: 'settings',
    component: SettingsComponent,
    pathMatch: 'full'
  },
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  {
    path: 'error404',
    component: ErrorComponent,
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: '/error404'
  }
];
