import { Component, HostBinding } from '@angular/core';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.scss']
})

export class ContactUsComponent {

  @HostBinding('class.lang-ru') langRu = false;
  public pageTitle = "contact us";

  constructor(
  ) { 

  }

  toggleLanguage() {
    this.langRu = !this.langRu;
  }

}
