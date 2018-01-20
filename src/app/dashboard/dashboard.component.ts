import { Title } from '@angular/platform-browser';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { historyRates, realTimeMockRates } from './data';
import { TdLoadingService, TdMediaService, TdDigitsPipe, TdRotateAnimation, CovalentJsonFormatterModule } from '@covalent/core';
import * as moment from 'moment';

// table
import { TdDataTableService, TdDataTableSortingOrder, ITdDataTableSortChangeEvent, ITdDataTableColumn } from '@covalent/core';
import { IPageChangeEvent } from '@covalent/core';
import { Currency } from '../models/currency';
import { Item } from '../models/item';
import { IntervalObservable } from 'rxjs/observable/IntervalObservable';

import { ForexService, ItemsService, ProductsService, AlertsService } from '../../services';
import { TextUtils, ArrayUtils } from '../../utils';

const DECIMAL_FORMAT: (v: any) => any = (v: number) => v.toFixed(3);

@Component({
  selector: 'qs-dashboard',
  viewProviders: [TextUtils, ForexService, ItemsService, ProductsService, AlertsService],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  animations: [
    TdRotateAnimation(),
  ],
})
export class DashboardComponent implements OnInit {

  items: Item[];
  marketOpen: boolean = false;

  // Chart
  historyRates: any[];
  realTimeMockRates: any[];

  view: any[] = [700, 400];

  // line, area
  autoScale: boolean = true;
  showXAxis: boolean = true;
  showYAxis: boolean = true;
  gradient: boolean = false;
  showXAxisLabel: boolean = true;
  xAxisLabel: string = '';
  showYAxisLabel: boolean = true;
  yAxisLabel: string = 'Rate';
  intervalId;

  colorScheme: any = {
    domain: ['#1565C0', '#2196F3', '#81D4FA', '#FF9800', '#EF6C00'],
  };

  // Timeframe
  dateFrom: Date = new Date(new Date().getTime());
  dateTo: Date = new Date(new Date().getTime());
  maxFromDate: Date =  new Date(new Date().getTime() /*- (365 * 60 * 60 * 24 * 1000)*/);
  maxToDate: Date = new Date(new Date().getTime());

  currencies: Currency[] = [];

  // Table
  columns: ITdDataTableColumn[] = [
    { name: 'symbol',  label: 'Symbol', sortable: true, filter: true},
    { name: 'price', label: 'Price $', sortable: true, filter: true, numeric: true, format: DECIMAL_FORMAT },
    { name: 'bid', label: 'Bid', sortable: true, filter: true, hidden: false, numeric: true },
    { name: 'ask', label: 'Ask', sortable: true, filter: true, numeric: true },
    { name: 'timestamp', label: 'Timestamp', sortable: true, filter: true, width: 350 },
  ];

  filteredNewsBySelectedRows: any[] = this.items;
  filteredHistoryBySelectedRows: any[] = this.historyRates;
  filteredRealTimeBySelectedRows: any[] = this.realTimeMockRates;

  filteredData: any[] = this.currencies;
  filteredTotal: number = this.currencies.length;

  searchTerm: string = '';
  fromRow: number = 1;
  currentPage: number = 1;
  pageSize: number = 5;
  sortBy: string = 'price';
  selectedRows: any[] = [];
  sortOrder: TdDataTableSortingOrder = TdDataTableSortingOrder.Descending;
  datePickerEvents: string[] = [];

  constructor(
              private _titleService: Title,
              private _forexService: ForexService,
              private _changeDetectorRef: ChangeDetectorRef,
              private _iconRegistry: MatIconRegistry,
              private _dataTableService: TdDataTableService,
              private _domSanitizer: DomSanitizer,
              private _loadingService: TdLoadingService,

              public _itemsService: ItemsService,

              public media: TdMediaService,

              ) {
                // Chart
                this.historyRates = historyRates.map((group: any) => {
                  group.series = group.series.map((dataItem: any) => {
                    dataItem.name = new Date(dataItem.name);
                    return dataItem;
                  });
                  return group;
                });
                this.realTimeMockRates = realTimeMockRates.map((group: any) => {
                  group.series = group.series.map((dataItem: any) => {
                    dataItem.name = new Date(dataItem.name);
                    return dataItem;
                  });
                  return group;
                });
                //this.filteredHistoryBySelectedRows = this.historyRates;

                this.filteredRealTimeBySelectedRows = this.realTimeMockRates
;
                this._iconRegistry.addSvgIconInNamespace('assets', 'covalent',
                this._domSanitizer.bypassSecurityTrustResourceUrl
                ('https://raw.githubusercontent.com/Teradata/covalent-quickstart/develop/src/assets/icons/covalent.svg'));


                this._forexService.getForexData()
                  .subscribe((currencies) => {
                    this.currencies = currencies;
                    this.filter();
                });

                Object.assign(this, {historyRates, realTimeMockRates})

                // mimic random live stream
                this.intervalId = setInterval(() => {
                  this.filteredRealTimeBySelectedRows = [...this.addRandomValue()];
                }, 4000);
  }

  addRandomValue() {

    let value1 = Number((Math.random() * (0.220 - 0.09) + 0.09).toFixed(4));
    let value2 = Number((Math.random() * (0.830 - 0.2) + 0.2).toFixed(4));
    let value3 = Number((Math.random() * (1.23 - 0.3) + 0.3).toFixed(4));
    let value4 = Number((Math.random() * (0.95 - 0.1) + 0.1).toFixed(4));
    let value5 = Number((Math.random() * (1.5 - 0.2) + 0.2).toFixed(4));
    let value6 = Number((Math.random() * (0.1 - 0.05) + 0.05).toFixed(4));

    if(this.filteredRealTimeBySelectedRows && this.filteredRealTimeBySelectedRows[0]) this.filteredRealTimeBySelectedRows[0].series.push({"value": value1, "name": new Date});
    if(this.filteredRealTimeBySelectedRows && this.filteredRealTimeBySelectedRows[1]) this.filteredRealTimeBySelectedRows[1].series.push({"value": value2, "name": new Date});
    if(this.filteredRealTimeBySelectedRows && this.filteredRealTimeBySelectedRows[2]) this.filteredRealTimeBySelectedRows[2].series.push({"value": value3, "name": new Date});
    if(this.filteredRealTimeBySelectedRows && this.filteredRealTimeBySelectedRows[3]) this.filteredRealTimeBySelectedRows[3].series.push({"value": value4, "name": new Date});
    if(this.filteredRealTimeBySelectedRows && this.filteredRealTimeBySelectedRows[4]) this.filteredRealTimeBySelectedRows[4].series.push({"value": value5, "name": new Date});
    if(this.filteredRealTimeBySelectedRows && this.filteredRealTimeBySelectedRows[5]) this.filteredRealTimeBySelectedRows[5].series.push({"value": value6, "name": new Date});

    if (this.filteredRealTimeBySelectedRows && this.filteredRealTimeBySelectedRows[0] && this.filteredRealTimeBySelectedRows[0].series.length > 10) this.filteredRealTimeBySelectedRows[0].series.splice(0,1);
    if (this.filteredRealTimeBySelectedRows && this.filteredRealTimeBySelectedRows[1] && this.filteredRealTimeBySelectedRows[1].series.length > 10) this.filteredRealTimeBySelectedRows[1].series.splice(0,1);
    if (this.filteredRealTimeBySelectedRows && this.filteredRealTimeBySelectedRows[2] && this.filteredRealTimeBySelectedRows[2].series.length > 10) this.filteredRealTimeBySelectedRows[2].series.splice(0,1);
    if (this.filteredRealTimeBySelectedRows && this.filteredRealTimeBySelectedRows[3] && this.filteredRealTimeBySelectedRows[3].series.length > 10) this.filteredRealTimeBySelectedRows[3].series.splice(0,1);
    if (this.filteredRealTimeBySelectedRows && this.filteredRealTimeBySelectedRows[4] && this.filteredRealTimeBySelectedRows[4].series.length > 10) this.filteredRealTimeBySelectedRows[4].series.splice(0,1);
    if (this.filteredRealTimeBySelectedRows && this.filteredRealTimeBySelectedRows[5] && this.filteredRealTimeBySelectedRows[5].series.length > 10) this.filteredRealTimeBySelectedRows[5].series.splice(0,1);

    return this.filteredRealTimeBySelectedRows;
  }

  ngOnInit(): void {

    // broadcast to all listener observables when loading the page
    this.media.broadcast();
    this._changeDetectorRef.detectChanges();

    // forex api service polls every hour to save events
    IntervalObservable.create(600000)
      .subscribe(n => {
        this._forexService.getForexData()
          .subscribe((currencies) => {
            this.currencies = currencies;
            this.filter();
          });
      });

    this.checkMarketStatus();

    this._titleService.setTitle('Covalent Currency Exchange Demo');

    this._loadingService.register('items.load');
    this._itemsService.query().subscribe((items: Item[]) => {
      this.items = items;
      this.filteredNewsBySelectedRows = items;
      setTimeout(() => {
        this._loadingService.resolve('items.load');
      }, 750);
    }, (error: Error) => {
      this._itemsService.staticQuery().subscribe((items: Item[]) => {
        this.items = items;
        this.filteredNewsBySelectedRows = items;
        setTimeout(() => {
          this._loadingService.resolve('items.load');
        }, 750);
      });
    });
  }

  checkMarketStatus(){

    this._forexService.checkMarketStatus()
      .subscribe((response) => {
        this.marketOpen = response
    });
  }

  addDatepickerEvent(type: string, event: MatDatepickerInputEvent<Date>) {

    this.datePickerEvents.push(`${type}: ${event.target.value}`);

    let newData:any[] = [];

    let dateFrom = moment(this.dateFrom).startOf('day').format('DD-MM-YYYY HH:mm:ss');
    let dateTo = moment(this.dateTo).endOf('day').format('DD-MM-YYYY HH:mm:ss');

    console.log('dateFrom ', this.dateFrom)
    console.log('dateTo ', this.dateTo)

    this.filteredNewsBySelectedRows = this.items;

    Object.keys(this.filteredNewsBySelectedRows).map((item) => {

      let created  = moment(this.filteredNewsBySelectedRows[item].created).format('DD-MM-YYYY HH:mm:ss');

      if(created >= dateFrom && created <= dateTo) {
        newData.push(this.filteredNewsBySelectedRows[item])
      }

    });

    this.filteredNewsBySelectedRows = newData;

  }

  sort(sortEvent: ITdDataTableSortChangeEvent): void {
    //console.log('sort ITdDataTableSortChangeEvent ', sortEvent)
    this.sortBy = sortEvent.name;
    this.sortOrder = sortEvent.order;
    this.filter();
  }

  search(searchTerm: string): void {
    //console.log('search searchTerm ', searchTerm)
    this.searchTerm = searchTerm;
    this.filter();
  }

  page(pagingEvent: IPageChangeEvent): void {
    //console.log('page IPageChangeEvent ', pagingEvent)
    this.fromRow = pagingEvent.fromRow;
    this.currentPage = pagingEvent.page;
    this.pageSize = pagingEvent.pageSize;
    this.filter();
  }

  rowSelected(event: any): void {

    let newData: any[] = [];
    let newHistoryData: any[] = [];
    let newRealTimeData: any[] = [];

    this.filteredNewsBySelectedRows = [];
    this.filteredHistoryBySelectedRows = [];
    this.filteredRealTimeBySelectedRows = [];

    let a = Object.keys(this.selectedRows).map((item) => this.selectedRows[item].symbol);
    let b = Object.keys(this.items).map((item) => this.items[item].symbol);

    let intersect = ArrayUtils.intersect(a,b);

    let c = Object.keys(this.selectedRows).map((item) => this.selectedRows[item].symbol);
    let d = Object.keys(this.realTimeMockRates).map((item) => this.realTimeMockRates[item].name);


    //let intersectHistory = ArrayUtils.intersect(c,d);
    let intersectRealTime = ArrayUtils.intersect(c,d);

    //console.log('c ', intersectRealTime)
    //console.log('d ', intersectRealTime)
    console.log('intersectRealTime ', intersectRealTime)

    Object.keys(this.items).map((item) => {
      if (intersect.includes(this.items[item].symbol)) {
        newData.push(this.items[item])
      }
    })
    Object.keys(this.realTimeMockRates).map((item) => {
      if (intersectRealTime.includes(this.realTimeMockRates[item].name)) {
        //newHistoryData.push(this.realTimeMockRates[item])
        newRealTimeData.push(this.realTimeMockRates[item])
      }
    })

    //this.filteredHistoryBySelectedRows = (intersectHistory.length > 0) ? newHistoryData : this.historyRates;
    this.filteredRealTimeBySelectedRows = (intersectRealTime.length > 0) ? newRealTimeData : this.realTimeMockRates;

    if(event.selected && intersect.length === 0 && newData.length === 0) return;

    this.filteredNewsBySelectedRows = (intersect.length > 0) ? newData : this.items;

  }

  deleteArticle(event){
    console.log('deleteArticle in DASHBOARD ', event)
    this._itemsService.deleteItemById(event.id)
      .subscribe(
        res => {
          this.items.forEach((t:any, i:number) => {
            if(t.id === event.id) this.items.splice(i, 1);
          });
        },
        err => {
          console.log("Error occured ", err);
        }
      )
  }

  filter(): void {

    let newData: any[] = this.currencies;
    let excludedColumns: string[] = this.columns.filter((column: ITdDataTableColumn) => {
      return ((column.filter === undefined && column.hidden === true) ||
              (column.filter !== undefined && column.filter === false));
    }).map((column: ITdDataTableColumn) => {
      return column.name;
    });

    //console.log('filter excludedColumns ', excludedColumns);
    //console.log('filter newData before ', newData);

    newData = this._dataTableService.filterData(newData, this.searchTerm, true, excludedColumns);

    //console.log('filter newData after ', newData)

    this.filteredTotal = newData.length;

    //console.log('filteredTotal ', this.filteredTotal);

    newData = this._dataTableService.sortData(newData, this.sortBy, this.sortOrder);
    newData = this._dataTableService.pageData(newData, this.fromRow, this.currentPage * this.pageSize);

    //console.log('newData filteredTotal ', newData);

    this.filteredData = newData;

    console.log('END filter filteredData: ', this.filteredData)
    //console.log('END filter currencies: ', this.currencies)
  }

  // ngx transform using covalent digits pipe
  axisDigits(val: any): any {
    return new TdDigitsPipe().transform(val, 4);
  }
}
