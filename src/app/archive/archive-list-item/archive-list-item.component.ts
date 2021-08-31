import { Component, Input, OnDestroy, OnInit } from '@angular/core';

import { Subscription } from 'rxjs';

import { CartService } from '../../cart/shared/cart.service';

import { CartItem } from '../../models/cart-item.model';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-archive-list-item',
  templateUrl: './archive-list-item.component.html',
  styleUrls: ['./archive-list-item.component.scss']
})
export class ArchiveListItemComponent implements OnInit, OnDestroy {
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
  }
}
