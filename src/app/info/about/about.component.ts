import { Component, HostBinding } from '@angular/core';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})

export class AboutComponent {

  @HostBinding('class.lang-ru') langRu = true;
  public pageTitle = "about";

  constructor(
  ) { 
  }

  toggleLanguage(indicator) {
    this.langRu = indicator;
  }

}
