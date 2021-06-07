import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CheckoutService } from '../shared/checkout.service';
import { Customer } from '../../models/customer.model';

@Component({
  selector: 'app-checkout-shipping',
  templateUrl: './shipping.component.html',
  styleUrls: ['./shipping.component.scss']
})
export class ShippingComponent implements OnInit {
  public formShipping: FormGroup;
  public shippingMethods: { method: string, time: string, fee: number, value: string }[];

  constructor(private checkoutService: CheckoutService) { }

  ngOnInit() {
    this.shippingMethods = [
      {
        method: 'SDEK',
        fee: 3,
        time: '/ 5-7 days',
        value: 'priority'
      },
      {
        method: 'express',
        time: '/ 1-2 days',
        fee: 10,
        value: 'economy'
      }
    ];
    this.formShipping = new FormGroup({
      'shippingMethod': new FormControl(this.shippingMethods[1].value, Validators.required)
    });
  }

  public onBack() {
    this.checkoutService.previousStep();
  }

  public onContinue() {
    this.checkoutService.setShippingMethod(this.formShipping.controls.shippingMethod.value);
    this.checkoutService.nextStep();
  }

}
