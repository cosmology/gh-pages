import { Injectable } from '@angular/core';
import { Response, Headers } from '@angular/http';
import { HttpInterceptorService, RESTService } from '@covalent/http';
import { MOCK_API } from '../config/api.config';
import 'rxjs/add/operator/map';

@Injectable()
export class AlertsService extends RESTService<any> {

  constructor(private _http: HttpInterceptorService) {
    super(_http, {
      baseUrl: MOCK_API,
      path: '/alerts',
      baseHeaders: new Headers(),
      dynamicHeaders: () => new Headers(),
      transform: (res: Response): any => res.json(),
    });
  }

  staticQuery(): any {
    console.log('AlertsService staticQuery this', this)
    return this._http.get(MOCK_API+'/alerts')
    .map((res: Response) => {
      console.log('AlertsService staticQuery res', res)
      return res.json();
    });
  }

  query(): any {

   return this._http.get(MOCK_API+'/alerts')
   .map((res: Response) => {
     console.log('AlertsService query res', res)
     return res.json();
   });
  }

  get(id: string): any {
   return this._http.get(MOCK_API+'/alerts')
   .map((res: Response) => {
     let item: any;
     res.json().forEach((s: any) => {
       if (s.item_id === id) {
         item = s;
       }
     });
     return item;
   });
  }
}
