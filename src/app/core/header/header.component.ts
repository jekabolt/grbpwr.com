import { Component, OnDestroy, OnInit, HostListener } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import {CartService} from '../../cart/shared/cart.service';
import { LocaleService } from '../../services/locale-storage.service'


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.style.scss/header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  public currencySelected: string;
  public usd: boolean;
  public eur: boolean;
  public rub: boolean;
  public navbarOpened = false
  public infoOpened = false
  public onMenuToggle(e: Event) {
    e.preventDefault();
  }


  constructor(
    public cartService: CartService,
    private router: Router,
    public localeService: LocaleService,
  ) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.hideNavbar()
    });
  }

  toggleNavbar() {
    this.navbarOpened = !this.navbarOpened;
  }

  hideNavbar() {
    this.navbarOpened = false;
  }

  @HostListener('window:keydown.escape', ['$event'])
  keyEvent(event: KeyboardEvent) {
    this.hideNavbar()
  }
  

  ngOnInit() {
    this.currencySelected = this.localeService.getCurrency()
    this.setCurrency(this.currencySelected)
  }

  setCurrency(currency){
    switch (currency) {
      case "usd":
          this.usd = true
          this.eur = false
          this.rub = false
          break;
      case "eur":
          this.usd = false
          this.eur = true
          this.rub = false
          break;
      case "rub":
          this.usd = false
          this.eur = false
          this.rub = true
          break;
      default:
          console.log("No such currency exists!");
          this.usd = true
          break;
    }
  }
  

  ngOnDestroy() {

  }
}
