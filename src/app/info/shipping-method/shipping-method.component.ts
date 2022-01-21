import { Component, HostBinding } from '@angular/core';

@Component({
  selector: 'app-shipping-method',
  templateUrl: './shipping-method.component.html',
  styleUrls: ['./shipping-method.component.scss']
})

export class ShippingMethodsComponent {

  @HostBinding('class.lang-ru') langRu = true;

  constructor(
  ) { 
  }

  toggleLanguage(indicator) {
    this.langRu = indicator;
  }

}
