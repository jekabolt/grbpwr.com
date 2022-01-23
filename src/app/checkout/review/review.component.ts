import {Component, OnDestroy, OnInit} from '@angular/core';
import {Router} from '@angular/router';

import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

import {CheckoutService} from '../shared/checkout.service';
import {CartService} from '../../cart/shared/cart.service';

import {CartItem} from '../../models/cart-item.model';
import {Customer} from '../../models/customer.model';
import {Order} from '../../models/order.model';
import { LocaleService } from '../../services/locale-storage.service'

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
  public currencySelected: string;

  constructor(
    private cartService: CartService,
    private checkoutService: CheckoutService,
    private router: Router,
    public localeService: LocaleService,
  ) { }

  ngOnInit() {
    this.currencySelected = this.localeService.getCurrency()
    this.items = this.cartService.getItems();
    this.total = this.cartService.getTotal(this.currencySelected);
    this.cartService.itemsChanged
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe((items: CartItem[]) => {
      this.items = items;
      this.total = this.cartService.getTotal(this.currencySelected);
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
    // TODO:
    const userUid = 1
    const order = this.checkoutService.getOrderInProgress();
    const total = this.cartService.getTotal(this.currencySelected);

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
