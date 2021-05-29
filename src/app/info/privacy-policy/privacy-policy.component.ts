import { Component, HostBinding } from '@angular/core';

@Component({
  selector: 'app-privacy-policy',
  templateUrl: './privacy-policy.component.html',
  styleUrls: ['./privacy-policy.component.scss']
})

export class PrivacyPolicyComponent {

  @HostBinding('class.lang-ru') langRu = false;

  constructor() { }

  toggleLanguage() {
    this.langRu = !this.langRu;
  }

}
