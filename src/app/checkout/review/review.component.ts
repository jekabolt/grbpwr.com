import {Component, OnDestroy, OnInit} from '@angular/core';
import {Router} from '@angular/router';

import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

import {CheckoutService} from '../shared/checkout.service';
import {CartService} from '../../cart/shared/cart.service';

import {CartItem} from '../../models/cart-item.model';
import {Customer} from '../../models/customer.model';
import {Order} from '../../models/order.model';
import {User} from '../../models/user.model';

@Component({
  selector: 'app-checkout-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.scss']
})
export class ReviewComponent implements OnInit, OnDestroy {
  items: CartItem[];
  total: number;
  customer: Customer;
  paymentMethod: string;
  unsubscribe$ = new Subject();
  user: User;


  constructor(
    private cartService: CartService,
    private checkoutService: CheckoutService,
    private router: Router,
  ) { }

  ngOnInit() {

    this.items = this.cartService.getItems();
    this.total = this.cartService.getTotal();
    this.cartService.itemsChanged
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((items: CartItem[]) => {
        this.items = items;
        this.total = this.cartService.getTotal();
      });
    this.customer = this.checkoutService.getOrderInProgress().customer;
    this.checkoutService.orderInProgressChanged
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((order: Order) => {
        this.customer = order.customer;
        this.paymentMethod = order.paymentMethod;
      });
  }

  public onBack() {
    this.checkoutService.previousStep();
  }

  public onCompleteOrder() {
    const userUid = this.user ? this.user.uid : false;
    const order = this.checkoutService.getOrderInProgress();
    const total = this.cartService.getTotal();

    this.checkoutService.setOrderItems(this.cartService.getItems());

    if (userUid) {
      this.submitUserOrder(order, total, userUid);
    } else {
      this.submitAnonOrder(order, total);
    }
  }

  private submitUserOrder(order, total, userUid) {

  }

  private submitAnonOrder(order, total) {

  }

  ngOnDestroy() {
    if(this.unsubscribe$ && !this.unsubscribe$.closed)
    this.unsubscribe$.unsubscribe();
  }
}
