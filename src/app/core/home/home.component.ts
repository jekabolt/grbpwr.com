import {Component, OnDestroy, OnInit} from '@angular/core';

import {Subject} from 'rxjs';

import {ProductService} from '../../products/shared/product.service';
import {ProductsCacheService} from '../../products/shared/products-cache.service';

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
    private productsCache: ProductsCacheService,
    private productService: ProductService,
  ) { }

  ngOnInit() {
  }

  ngOnDestroy() {
    // this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
