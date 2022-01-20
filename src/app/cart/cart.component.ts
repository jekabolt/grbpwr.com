import { Component, OnInit, OnDestroy } from '@angular/core';
import {Title} from "@angular/platform-browser";

import { Subscription } from 'rxjs';

import { CartService } from './shared/cart.service';
import { CartItem } from '../models/cart-item.model';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit, OnDestroy {
  private cartSubscription: Subscription;
  public items: CartItem[];
  public total: number;
  public pageTitle = "cart";

  constructor(
    private cartService: CartService,
    private titleService: Title
  ) { 
    this.titleService.setTitle(this.pageTitle);
  }

  ngOnInit() {
    this.items = this.cartService.getItems();
    this.total = this.cartService.getTotal();
    this.cartSubscription = this.cartService.itemsChanged.subscribe(
      (items: CartItem[]) => {
        this.items = items;
        this.total = this.cartService.getTotal();
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


  ngOnDestroy() {
    if(this.cartSubscription && !this.cartSubscription.closed)
    this.cartSubscription.unsubscribe();
  }
}
