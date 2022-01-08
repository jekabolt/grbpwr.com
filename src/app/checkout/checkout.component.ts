import { Component, OnDestroy, OnInit } from '@angular/core';
import { Title } from "@angular/platform-browser";

import { Subscription } from 'rxjs';

import { CheckoutService } from './shared/checkout.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit, OnDestroy {
  checkoutSubscription: Subscription;
  steps: string[];
  activeStep: number;
  public pageTitle = "checkout";

  constructor(
    private checkoutService: CheckoutService,
    private titleService: Title
  ) {
    this.titleService.setTitle(this.pageTitle);
  }

  ngOnInit() {
    this.steps = ['1. Address', '2. Shipping', '3. Payment', '4. Review'];
    this.activeStep = this.checkoutService.activeStep;
    this.checkoutSubscription = this.checkoutService.stepChanged.subscribe((step: number) => {
      this.activeStep = step;
    });
  }

  ngOnDestroy() {
    if(this.checkoutSubscription && !this.checkoutSubscription.closed)
    this.checkoutSubscription.unsubscribe();
  }
}
