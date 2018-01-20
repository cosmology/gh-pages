import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/toPromise';

// these are used to fake locally using config file
import { environment } from '../../environments/environment';
import { HttpInterceptorService } from '@covalent/http';
import {Configuration} from '../../assets/config/config.model';

import { APP_SETTINGS } from '../../assets/config/settings';

@Injectable()
export class AppLoadService {

  constructor(private httpClient: HttpClient, private _http: HttpInterceptorService) { }

  initializeApp(): Promise<any> {
    return new Promise((resolve, reject) => {
          console.log(`initializeApp:: inside promise`);

          // intentionally added timeout on resolve to integrate later animated loader
          setTimeout(() => {
            console.log(`initializeApp:: inside setTimeout`);
            // showing animated loader while doing something...
            resolve();
          }, 3000);
        });
  }

  // faking local config load
  getSettings(): Promise<any> {
    console.log(`getConfig:: before http.get call`);

    const promise = this._http.get(environment.configFile).map(res => res.json())
      .toPromise()
      .then(config => {
        console.log('faking API call from locally loaded condif: ', config);

        APP_SETTINGS.apiBaseKey = Object.assign(new Configuration, config).apiBaseKey;
        APP_SETTINGS.apiBaseUrl = Object.assign(new Configuration, config).apiBaseUrl;

        console.log('APP_SETTINGS ', APP_SETTINGS);

      });

    return promise;
  }

  // useing apiary-mock for better API testing
  /*getSettings(): Promise<any> {
    console.log(`getSettings:: before http.get call`);
    const promise = this.httpClient.get('http://private-1ad25-initializeng.apiary-mock.com/settings')
      .toPromise()
      .then(settings => {
        console.log(`Settings from API: `, settings);

        APP_SETTINGS.connectionString = settings[0].value;
        APP_SETTINGS.defaultImageUrl = settings[1].value;

        console.log(`APP_SETTINGS: `, APP_SETTINGS);

        return settings;
      });

    return promise;
  }*/
}
