import { Component, HostBinding } from '@angular/core';

@Component({
  selector: 'app-privacy-policy',
  templateUrl: './privacy-policy.component.html',
  styleUrls: ['./privacy-policy.component.scss']
})

export class PrivacyPolicyComponent {

  @HostBinding('class.lang-ru') langRu = true;

  public pageTitle = "privacy";

  constructor(
  ) { 
    
  }

  toggleLanguage(indicator) {
    this.langRu = indicator;
  }

}
