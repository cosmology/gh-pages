import { Component, OnInit, Input } from '@angular/core';
import {Item} from "../models/item";
import { ItemsService } from '../../services';
import {Router} from "@angular/router";
import 'rxjs/add/operator/finally';

@Component({
  selector: 'article',
  viewProviders: [ ItemsService],
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.css']
})
export class ArticleComponent implements OnInit {

  @Input() item: Item;

  constructor(
    private _itemsService: ItemsService,
    private _router: Router
  ) {}

  ngOnInit() {}

}
