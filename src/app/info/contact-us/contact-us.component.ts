import { Component, HostBinding } from '@angular/core';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.scss']
})

export class ContactUsComponent {

  @HostBinding('class.lang-ru') langRu = false;

  constructor() { }

  toggleLanguage() {
    this.langRu = !this.langRu;
  }

}
