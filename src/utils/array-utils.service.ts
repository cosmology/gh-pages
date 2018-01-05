/**
 * Created by ivanprokic on 12/24/17.
 */
import {Injectable } from '@angular/core';
@Injectable()
export class ArrayUtils {


    public static intersect(a, b){
      return [a, b].reduce((a, b) => a.filter(c => b.includes(c)));
    }

    public sortByAsc(collection: any, fieldName: string): any {
        return collection.sort((param1, param2) => {
            return param1[fieldName] < param2[fieldName] ? -1 :
                (param1[fieldName] > param2[fieldName] ? 1 : 0);
        });
    }

    public sortByDesc(collection: any, fieldName: string): any {
        return collection.sort((param1, param2) => {
            return param1[fieldName] > param2[fieldName] ? -1 :
                (param1[fieldName] < param2[fieldName] ? 1 : 0);
        });
    }
}
