import { Component, OnDestroy, OnInit } from '@angular/core';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { ProductService } from '../../products/shared/product.service';
import { ProductsCacheService } from '../../products/shared/products-cache.service';
import { PromoService } from '../shared/promo.service';

import { Product } from '../../models/product.model';
import { Promo } from '../../models/promo.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  private unsubscribe$ = new Subject();
  public products: Product[];
  public productsFeatured: any;
  public productsNewArrivals: Product[];
  public productsOnSale: Product[];
  public productsBestRated: Product[];
  public promos: Promo[];

  constructor(
    private productsCache: ProductsCacheService,
    private productService: ProductService,
    private promoService: PromoService
  ) { }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
