/**
 * Created by ivanprokic on 12/24/17.
 */
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { Currency } from '../app/models/currency'
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap'
import 'rxjs/add/observable/interval';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import 'rxjs/add/observable/timer';
import 'rxjs/add/operator/mergeMap';
import { IntervalObservable } from 'rxjs/observable/IntervalObservable';
import { TextUtils } from '../utils/text-utils.service'

const API_URL = environment.forexApi;

export interface ICurrency {
  symbol: '';
  price: number;
  bid: number;
  ask: number;
  timestamp: number;
}

@Injectable()
export class ForexService {

  static currencies: Currency[] = [];

  private _currencies:Currency[] = [];

  get currencies():Currency[] {
      return this._currencies;
  }
  set currencies(currencies:Currency[]) {
      this._currencies = currencies;
  }

  constructor(
    private _http: Http,
    private _util: TextUtils
  ) {
  }

  public getForexData(): Observable<Currency[]> {

    return this._http
      .get(API_URL)
      .map(response => {
        const currencies = response.json();

        // keep this mock in case we get over quota
        /*const currencies = [
           {
              'symbol': 'AUDUSD',
              'price': 0.792495,
              'bid': 0.79248,
              'ask': 0.79251,
              'timestamp': new Date(1502160795*1000).toLocaleString()
           },
           {
              'symbol': 'EURUSD',
              'price': 2.792495,
              'bid': 1.18099,
              'ask': 1.18101,
              'timestamp': new Date(1502160795*1000).toLocaleString()
           },
           {
              'symbol': 'GBPJPY',
              'price': 144.3715,
              'bid': 144.368,
              'ask': 144.375,
              'timestamp': new Date(1502160795*1000).toLocaleString()
           }
        ];*/
        return currencies.map(
          (currency) => {
            currency.symbol = this._util.insertSlash(currency.symbol);
            //currency.price = `$${currency.price}`;
            currency.timestamp = new Date(currency.timestamp*1000).toLocaleString();
            return new Currency(currency)}
        );
      })
      .catch(this.handleError);
  }

  private handleError (error: Response | any) {
    console.error('ApiService::handleError', error);
    return Observable.throw(error);
  }
}
