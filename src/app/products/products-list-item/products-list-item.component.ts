import { Component, Input, OnDestroy, OnInit } from '@angular/core';

import { Subscription } from 'rxjs';

import { CartService } from '../../cart/shared/cart.service';

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

  constructor(
    private cartService: CartService,
  ) { }

  ngOnInit() {
    this.imageLoading = true;
  }

  public onAddToCart() {
    this.cartService.addItem(new CartItem(this.product, 1, this.product.selectedSize));
  }

  public onImageLoad() {
    this.imageLoading = false;
  }

  ngOnDestroy() {
    if(this.userSubscription && !this.userSubscription.closed)
    this.userSubscription.unsubscribe();
  }
}
