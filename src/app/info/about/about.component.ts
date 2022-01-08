import { Component, HostBinding } from '@angular/core';
import {Title} from "@angular/platform-browser";

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})

export class AboutComponent {

  @HostBinding('class.lang-ru') langRu = true;
  public pageTitle = "about";

  constructor(
    private titleService: Title,
  ) { 
    this.titleService.setTitle(this.pageTitle);
  }

  toggleLanguage(indicator) {
    this.langRu = indicator;
  }

}
