import { Title } from '@angular/platform-browser';
import { Component, OnInit, ChangeDetectorRef, EventEmitter, Output } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry, MatDialog } from '@angular/material';
import { DatePipe } from '@angular/common';
import { Router } from "@angular/router";
import { single, multi, times } from './data';
import { TdLoadingService, TdMediaService, TdDigitsPipe, TdLayoutManageListComponent, TdRotateAnimation } from '@covalent/core';

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

  // Chart
  single: any[];
  multi: any[];

  view: any[] = [700, 400];

  // options
  showXAxis: boolean = true;
  showYAxis: boolean = true;
  gradient: boolean = false;
  showLegend: boolean = false;
  showXAxisLabel: boolean = true;
  xAxisLabel: string = '';
  showYAxisLabel: boolean = true;
  yAxisLabel: string = 'Sales';

  colorScheme: any = {
    domain: ['#1565C0', '#2196F3', '#81D4FA', '#FF9800', '#EF6C00'],
  };

  // Timeframe
  dateFrom: Date = new Date(new Date().getTime() - (2 * 60 * 60 * 24 * 1000));
  dateTo: Date = new Date(new Date().getTime() - (1 * 60 * 60 * 24 * 1000));
  maxFromDate: Date = new Date(new Date().getTime() - (1000 * 60 * 60 * 24 * 1000));
  maxToDate: Date = new Date(new Date().getTime());

  // line, area
  autoScale: boolean = true;

  currencies: Currency[] = [];

  // Table
  columns: ITdDataTableColumn[] = [
    { name: 'symbol',  label: 'Symbol', sortable: true, filter: true},
    { name: 'price', label: 'Price', sortable: true, filter: true, numeric: true, format: DECIMAL_FORMAT },
    { name: 'bid', label: 'Bid', sortable: true, filter: true, hidden: false, numeric: true },
    { name: 'ask', label: 'Ask', sortable: true, filter: true, numeric: true },
    { name: 'timestamp', label: 'Timestamp', sortable: true, filter: true, width: 350 },
  ];

  filteredNewsBySelectedRows: any[] = this.items;
  filteredData: any[] = this.currencies;
  filteredTotal: number = this.currencies.length;

  searchTerm: string = '';
  fromRow: number = 1;
  currentPage: number = 1;
  pageSize: number = 5;
  sortBy: string = 'price';
  selectedRows: any[] = [];
  sortOrder: TdDataTableSortingOrder = TdDataTableSortingOrder.Descending;

  constructor(
              private _titleService: Title,
              private _productsService: ProductsService,
              private _alertsService: AlertsService,
              private _forexService: ForexService,
              private _changeDetectorRef: ChangeDetectorRef,
              private _iconRegistry: MatIconRegistry,
              private _dataTableService: TdDataTableService,
              private _domSanitizer: DomSanitizer,
              private _loadingService: TdLoadingService,
              private _router: Router,

              public _itemsService: ItemsService,

              public media: TdMediaService,
              public dialog: MatDialog,
              ) {
                // Chart
                this.multi = multi.map((group: any) => {
                  group.series = group.series.map((dataItem: any) => {
                    dataItem.name = new Date(dataItem.name);
                    return dataItem;
                  });
                  return group;
                });

              this._iconRegistry.addSvgIconInNamespace('assets', 'covalent',
              this._domSanitizer.bypassSecurityTrustResourceUrl
              ('https://raw.githubusercontent.com/Teradata/covalent-quickstart/develop/src/assets/icons/covalent.svg'));

              this._forexService.getForexData()
                .subscribe((currencies) => {
                  this.currencies = currencies;
                  this.filter();
              });
              Object.assign(this, {single, multi, times})
  }

  ngOnInit(): void {

    // broadcast to all listener observables when loading the page
    this.media.broadcast();
    this._changeDetectorRef.detectChanges();

    // forex api service
    IntervalObservable.create(500000)
      .subscribe(n => {
      this._forexService.getForexData()
      .subscribe((currencies) => {
        this.currencies = currencies;
        this.filter();
      });
    });

    this._titleService.setTitle( 'Forex Exchange' );

    /*this._loadingService.register('alerts.load');
    this._alertsService.query().subscribe((alerts: Object[]) => {
      this.alerts = alerts;
      setTimeout(() => {
        this._loadingService.resolve('items.load');
      }, 750);
    }, (error: Error) => {
      console.log('\nError loading alerts ', error)
      this._alertsService.staticQuery().subscribe((alerts: Object[]) => {
        setTimeout(() => {
          this._loadingService.resolve('alerts.load');
        }, 750);
      });
    });*/

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

    /*this._loadingService.register('products.load');
    this._productsService.query().subscribe((products: Object[]) => {
      this.products = products;
      setTimeout(() => {
        this._loadingService.resolve('products.load');
      }, 750);
    });

    this._loadingService.register('favorites.load');
    this._productsService.query().subscribe((products: Object[]) => {
      this.products = products;
      setTimeout(() => {
        this._loadingService.resolve('favorites.load');
      }, 750);
    });*/
  }

  sort(sortEvent: ITdDataTableSortChangeEvent): void {
    console.log('sort ITdDataTableSortChangeEvent ', sortEvent)
    this.sortBy = sortEvent.name;
    this.sortOrder = sortEvent.order;
    this.filter();
  }

  search(searchTerm: string): void {
    console.log('search searchTerm ', searchTerm)
    this.searchTerm = searchTerm;
    this.filter();
  }

  page(pagingEvent: IPageChangeEvent): void {
    console.log('page IPageChangeEvent ', pagingEvent)
    this.fromRow = pagingEvent.fromRow;
    this.currentPage = pagingEvent.page;
    this.pageSize = pagingEvent.pageSize;
    this.filter();
  }

  rowSelected(event: any): void {

    let newData: any[] = [];
    this.filteredNewsBySelectedRows = []

    let a = Object.keys(this.selectedRows).map((item) => this.selectedRows[item].symbol);
    let b = Object.keys(this.items).map((item) => this.items[item].symbol);

    let intersect = ArrayUtils.intersect(a,b);

    Object.keys(this.items).map((item) => {
      if (intersect.includes(this.items[item].symbol)) {
        newData.push(this.items[item])
      }
    })

    if(event.selected && intersect.length === 0 && newData.length === 0) return;

    this.filteredNewsBySelectedRows = (intersect.length > 0) ? newData : this.items;

  }

  deleteArticle(id:string){
    console.log('deleteArticle in DASHBOARD ')
    this._itemsService.deleteItemById(id)
      .subscribe(
        res => {
          this.items.forEach((t:any, i:number) => {
            if(t.id === id) this.items.splice(i, 1);
          });
        },
        err => {
          console.log("Error occured ", err);
        }
      )
  }

  filter(): void {

    //console.log('START filter currencies: ', this.currencies)

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

    //console.log('END filter filteredData: ', this.filteredData)
    //console.log('END filter currencies: ', this.currencies)
  }

  // ngx transform using covalent digits pipe
  axisDigits(val: any): any {
    return new TdDigitsPipe().transform(val);
  }
}
