import { Component, HostBinding } from '@angular/core';

@Component({
  selector: 'app-returns',
  templateUrl: './returns.component.html',
  styleUrls: ['./returns.component.scss']
})

export class ReturnsComponent {

  @HostBinding('class.lang-ru') langRu = false;

  constructor() { }

  toggleLanguage(indicator) {
    this.langRu = indicator;
  }

}
