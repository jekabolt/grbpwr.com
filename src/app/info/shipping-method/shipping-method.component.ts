import { Component, HostBinding } from '@angular/core';

@Component({
  selector: 'app-shipping-method',
  templateUrl: './shipping-method.component.html',
  styleUrls: ['./shipping-method.component.scss']
})

export class ShippingMethodsComponent {

  @HostBinding('class.lang-ru') langRu = false;

  public pageTitle = "shipping";

  constructor(
  ) { 
  }

  toggleLanguage(indicator) {
    this.langRu = indicator;
  }

}
