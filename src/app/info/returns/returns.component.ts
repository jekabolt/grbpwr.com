import { Component, HostBinding } from '@angular/core';
import {Title} from "@angular/platform-browser";

@Component({
  selector: 'app-returns',
  templateUrl: './returns.component.html',
  styleUrls: ['./returns.component.scss']
})

export class ReturnsComponent {

  @HostBinding('class.lang-ru') langRu = false;

  public pageTitle = "returns";

  constructor(
    private titleService: Title,
  ) { 
    this.titleService.setTitle(this.pageTitle);
  }

  toggleLanguage(indicator) {
    this.langRu = indicator;
  }

}
