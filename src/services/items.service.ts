import { Injectable } from '@angular/core';
import { Item  } from '../app/models/item'
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { HttpInterceptorService, RESTService } from '@covalent/http';
import { Router } from "@angular/router";
import { MOCK_API } from '../config/api.config';
import 'rxjs/add/operator/map';

export interface IItem {
  name: '';
  symbol: '';
  description: '';
  icon: 'view_headline';
  created: '';
  id: number;
}

@Injectable()
export class ItemsService extends RESTService<any> {

  constructor(
    private _http: HttpInterceptorService) {
    super(_http, {
      baseUrl: MOCK_API,
      path: '/items',
    });
  }

  public createItem(item: Item): Observable<Item> {
    console.log('createItem ', item);
    return this._http
      .post(MOCK_API+'/items', item)
      .map(response => {

        console.log('createItem response ', response)

        return new Item(response.json());
      })
      .catch(this.handleError);
  }

  public getItemById(todoId: number): Observable<Item> {
    return this._http
      .get(MOCK_API + '/items/' + todoId)
      .map(response => {
        return new Item(response.json());
      })
      .catch(this.handleError);
  }

  public updateItem(item: Item): Observable<Item> {
    return this._http
      .put(MOCK_API + '/items/' + item.id, Item)
      .map(response => {
        return new Item(response.json());
      })
      .catch(this.handleError);
  }

  public deleteItemById(itemId: string): Observable<null> {
    return this._http
      .delete(MOCK_API+'/items/' + itemId)
      .map(response => null)
      .catch(this.handleError);
  }

  private handleError (error: Response | any) {
    return Observable.throw(error);
  }

  public staticQuery(): any {

    console.log('staticQuery get items from ', MOCK_API+'/items');

    return this._http.get(MOCK_API+'/items')
    .map((res: Response) => {
      return res.json();
    });
  }

  public staticGet(id: string): any {

    console.log('staticGet get items from ', MOCK_API+'/items');

    return this._http.get(MOCK_API+'/items.json')
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
