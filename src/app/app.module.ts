import { NgModule, Type, APP_INITIALIZER } from '@angular/core';
import { BrowserModule, Title }  from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { FormsModule } from '@angular/forms';
import { Http, HttpModule, JsonpModule } from '@angular/http';

import { CovalentHttpModule, IHttpInterceptor } from '@covalent/http';
import { CovalentHighlightModule } from '@covalent/highlight';
import { CovalentMarkdownModule } from '@covalent/markdown';

import { AppComponent } from './app.component';
import { RequestInterceptor } from '../config/interceptors/request.interceptor';
import { MOCK_API } from '../config/api.config';

import { routedComponents, AppRoutingModule } from './app-routing.module';

import { SharedModule } from './shared/shared.module';

import { AppLoadModule } from '../app/loader/loader.module'

const httpInterceptorProviders: Type<any>[] = [
  RequestInterceptor,
];

export function getAPI(): string {
  return MOCK_API;
}

import { NgxChartsModule } from '@swimlane/ngx-charts';

@NgModule({
  declarations: [
    AppComponent,
    routedComponents],
    imports: [
      AppRoutingModule,
      BrowserModule,
      AppLoadModule,
      BrowserAnimationsModule,
      SharedModule,
      CovalentHttpModule.forRoot({
        interceptors: [{
          interceptor: RequestInterceptor, paths: ['**'],
        }],
      }),
      CovalentHighlightModule,
      CovalentMarkdownModule,
      FormsModule,
      HttpModule,
      JsonpModule,
      NgxChartsModule,
    ],
  providers: [
    httpInterceptorProviders
    ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
