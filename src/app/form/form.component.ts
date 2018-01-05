import { Component, OnInit, AfterViewInit, ChangeDetectorRef, Pipe } from '@angular/core';
import { FormBuilder, FormGroup, FormGroupDirective, NgForm, FormControl, Validators } from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';

import { StepState, TdMediaService } from '@covalent/core';
import { ItemsService } from '../../services';
import { Http, Response } from '@angular/http';
import { Router } from "@angular/router";
import uuid from 'uuid';
import * as moment from 'moment';

import { MOCK_API } from '../../config/api.config';

@Component({
  selector: 'qs-product-form',
  viewProviders: [ItemsService],
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
})

export class FormComponent implements AfterViewInit {

  private formSubmitAttempt: boolean;

  myGroup: FormGroup;
  nameInput: FormControl;
  descriptionInput: FormControl;
  symbolInput: FormControl;

  name:string = '';
  description:string = '';
  symbol:string = '';

  currencyPairs = [
    {value: 'EUR/USD', viewValue: 'EUR/USD'},
    {value: 'GBP/USD', viewValue: 'GBP/USD'},
    {value: 'NZD/USD', viewValue: 'NZD/USD'},
    {value: 'XAU/USD', viewValue: 'XAU/USD'},
    {value: 'AUD/USD', viewValue: 'AUD/USD'},
    {value: 'CHF/USD', viewValue: 'NZD/USD'}
  ];

  activeDeactiveStep1Msg: string = 'No select/deselect detected yet';
  stateStep2: StepState = StepState.Required;
  stateStep3: StepState = StepState.Complete;
  disabled: boolean = false;

  constructor(public media: TdMediaService,
              private _fb: FormBuilder,
              private _itemsService: ItemsService,
              private _router: Router,
              private _changeDetectorRef: ChangeDetectorRef) {

              this.myGroup = _fb.group({
                'name' : [null, Validators.compose([Validators.required, Validators.minLength(2)])],
                'description' : [null, Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(5)])],
                'symbol' : [null, Validators.required]
              });

              this.nameInput = this.myGroup.get('name') as FormControl;
              this.descriptionInput = this.myGroup.get('description') as FormControl;
              this.symbolInput = this.myGroup.get('symbol') as FormControl;

              //matcher = new MyErrorStateMatcher();
  }

  /*ngOnInit() {
    this.nameInput = this.myGroup.get('name') as FormControl;
    this.descriptionInput = this.myGroup.get('description') as FormControl;
    this.symbolInput = this.myGroup.get('symbol') as FormControl;
  }*/

  ngAfterViewInit(): void {
    // broadcast to all listener observables when loading the page
    this.media.broadcast();
    // force a new change detection cycle since change detections
    // have finished when `ngAfterViewInit` is executed
    this._changeDetectorRef.detectChanges();

    // set the group and add controls
    this.myGroup = new FormGroup({
      name: new FormControl(),
      symbol: new FormControl(),
      description: new FormControl()
    });
  }

  getArticleErrorMessage() {
    return this.nameInput.hasError('required') ? 'Article name is required' : '';

  }

  getSymbolErrorMessage(){
    return this.symbolInput.hasError('required') ? 'You have to pick a symbol pair' : '';
  }

  getDescriptionErrorMessage(){
    return this.descriptionInput.hasError('required') ? 'You have to enter article description' : ''
  }

  addArticle(item) {

    // spread
    const configureArticle = (item) => ({
      ...item,
      id: uuid.v4(),
      icon: 'description',
      created: moment(new Date())
    });


    if (this.myGroup.valid) {
      console.log('form valid and submitted');
      // call api service
      this._itemsService.createItem(configureArticle(item))
        .subscribe(
          res => {
            this._router.navigate(['']);
          },
          err => {
            console.log("Error occured ", err);
          }
      );
    } else {
      this.validateAllFormFields(this.myGroup); //{7}
    }
  }

  validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      console.log(field);
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      }
    });
  }

  reset() {
    this.myGroup.reset();
    //this.formSubmitAttempt = false;
  }

  toggleRequiredStep2(): void {
    this.stateStep2 = (this.stateStep2 === StepState.Required ? StepState.None : StepState.Required);
  }

  toggleCompleteStep3(): void {
    this.stateStep3 = (this.stateStep3 === StepState.Complete ? StepState.None : StepState.Complete);
  }

  toggleDisabled(): void {
    this.disabled = !this.disabled;
  }

  activeStep1Event(): void {
    this.activeDeactiveStep1Msg = 'Active event emitted.';
  }

  deactiveStep1Event(): void {
    this.activeDeactiveStep1Msg = 'Deactive event emitted.';
  }
}
