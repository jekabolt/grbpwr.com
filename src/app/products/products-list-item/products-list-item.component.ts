import { Component, Input, OnDestroy, OnInit } from '@angular/core';

import { Subscription } from 'rxjs';

import { CartService } from '../../cart/shared/cart.service';
import { LocaleService } from '../../services/locale-storage.service'

import { CartItem } from '../../models/cart-item.model';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-products-list-item',
  templateUrl: './products-list-item.component.html',
  styleUrls: ['./products-list-item.component.scss']
})
export class ProductsListItemComponent implements OnInit, OnDestroy {
  private userSubscription: Subscription;
  @Input() public product: Product;
  @Input() public displayMode: string;
  public imageLoading: boolean;
  public currencySelected: string;
  public usd: boolean;
  public eur: boolean;
  public rub: boolean;

  constructor(
    private cartService: CartService,
    public localeService: LocaleService,
  ) { }

  ngOnInit() {
    this.currencySelected = this.localeService.getCurrency()
    this.setCurrency(this.currencySelected)
    this.imageLoading = true;
  }

  public onAddToCart() {
    let ci: CartItem = {
      product:this.product.product,
      size:this.product.product.selectedSize
    };
    this.cartService.addItem(ci);
  }

  public onImageLoad() {
    this.imageLoading = false;
  }
  
  setCurrency(currency){
    switch (currency) {
      case "usd":
          this.usd = true
          this.eur = false
          this.rub = false
          break;
      case "eur":
          this.usd = false
          this.eur = true
          this.rub = false
          break;
      case "rub":
          this.usd = false
          this.eur = false
          this.rub = true
          break;
      default:
          console.log("No such currency exists!");
          this.usd = true
          break;
    }
  }

  ngOnDestroy() {
    if(this.userSubscription && !this.userSubscription.closed)
    this.userSubscription.unsubscribe();
  }
}
