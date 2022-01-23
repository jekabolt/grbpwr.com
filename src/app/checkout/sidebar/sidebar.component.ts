import { Component, OnInit } from '@angular/core';

import { CartService } from '../../cart/shared/cart.service';
import { LocaleService } from '../../services/locale-storage.service'

@Component({
  selector: 'app-checkout-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  public cartSubtotal: number;
  public shipping: number;
  public orderTotal: number;
  public currencySelected: string;

  constructor(
    private cartService: CartService,
    public localeService: LocaleService
    ) {}

  ngOnInit() {
    this.currencySelected = this.localeService.getCurrency()
    this.cartSubtotal = this.cartService.getTotal(this.currencySelected);
    // TODO: shipping, hardcoded for now
    this.shipping = 9;
    this.orderTotal = this.cartSubtotal + this.shipping;
  }
}
