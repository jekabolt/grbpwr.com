import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { LocaleService } from '../../services/locale-storage.service'

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  @Output() onCurrencyChange = new EventEmitter<string>();

  constructor(
    public localeService: LocaleService
  ) { }

  ngOnInit() {
  }

  updateCurrency(currency) {
    this.onCurrencyChange.emit(currency)
    this.localeService.setDefaultCurrency(currency)
  }
}
