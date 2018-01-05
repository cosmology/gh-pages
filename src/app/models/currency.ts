/**
 * Created by ivanprokic on 12/24/17.
 */
export class Currency {
  symbol: '';
  price: number;
  bid: number;
  ask: number;
  timestamp: number;

  constructor(values: Object = {}) {
    Object.assign(this, values);
  }
}
