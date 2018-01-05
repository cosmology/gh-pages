/**
 * Created by ivanprokic on 12/24/17.
 */
import {Injectable } from '@angular/core';
@Injectable()
export class TextUtils {

    public insertSlash(val: string) { return val.substring(0, 3) + "/" + val.substr(3); }

}
