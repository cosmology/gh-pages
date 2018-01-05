import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'qs-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent {

  isDarkTheme = false;

  routes: Object[] = [{
      title: 'Dashboard',
      route: '',
      icon: 'dashboard',
    }, {
      title: 'Add Market Article',
      route: '/form',
      icon: 'receipt',
    }
  ];

  constructor(private _router: Router) {}

  logout(): void {
    this._router.navigate(['/login']);
  }
}
