import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { CartService } from './shared/cart.service';
import { CartItem } from '../models/cart-item.model';
import { LocaleService } from '../services/locale-storage.service'

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit, OnDestroy {
  private cartSubscription: Subscription;
  public items: CartItem[];
  public total: number;
  public currencySelected: string;
  public usd: boolean;
  public eur: boolean;
  public rub: boolean;
  

  constructor(
    private cartService: CartService,
    public localeService: LocaleService,
  ) { 
  }

  ngOnInit() {
    this.currencySelected = this.localeService.getCurrency()
    this.setCurrency(this.currencySelected)
    this.items = this.cartService.getItems();
    this.total = this.cartService.getTotal(this.currencySelected);
    this.cartSubscription = this.cartService.itemsChanged.subscribe(
      (items: CartItem[]) => {
        this.items = items;
        this.total = this.cartService.getTotal(this.currencySelected);
      }
    );
  }

  public onClearCart(event) {
    event.preventDefault();
    event.stopPropagation();
    this.cartService.clearCart();
  }

  public onRemoveItem(event, item: CartItem) {
    event.preventDefault();
    event.stopPropagation();
    this.cartService.removeItem(item);
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
    if(this.cartSubscription && !this.cartSubscription.closed)
    this.cartSubscription.unsubscribe();
  }
}
