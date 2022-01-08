import { Component, HostBinding } from '@angular/core';
import {Title} from "@angular/platform-browser";

@Component({
  selector: 'app-shipping-method',
  templateUrl: './shipping-method.component.html',
  styleUrls: ['./shipping-method.component.scss']
})

export class ShippingMethodsComponent {

  @HostBinding('class.lang-ru') langRu = false;

  public pageTitle = "shipping";

  constructor(
    private titleService: Title,
  ) { 
    this.titleService.setTitle(this.pageTitle);
  }

  toggleLanguage(indicator) {
    this.langRu = indicator;
  }

}
