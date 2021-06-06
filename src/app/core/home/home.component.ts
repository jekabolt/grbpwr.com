import {Component, OnDestroy, OnInit} from '@angular/core';

import {Subject} from 'rxjs';


import {Product} from '../../models/product.model';
import {Promo} from '../../models/promo.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  private unsubscribe$ = new Subject();
  public products: Product[];
  public productsBestRated: Product[];

  constructor(

  ) { }

  ngOnInit() {
  }

  ngOnDestroy() {
    if(this.unsubscribe$ && !this.unsubscribe$.closed)
    this.unsubscribe$.unsubscribe();
  }
}
