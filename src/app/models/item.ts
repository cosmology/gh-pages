/**
 * Created by ivanprokic on 12/28/17.
 */
export class Item {
  name: '';
  symbol: '';
  description: '';
  icon: 'view_headline';
  created: '';
  id: number;

  constructor(values: Object = {}) {
    Object.assign(this, values);
  }
}
