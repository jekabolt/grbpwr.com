import { Component, OnDestroy, OnInit, HostListener } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import {CartService} from '../../cart/shared/cart.service';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.style.scss/header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  public navbarOpened = false
  public infoOpened = false
  public onMenuToggle(e: Event) {
    e.preventDefault();
  }


  constructor(
              public cartService: CartService,
              private router: Router) {
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

  }

  ngOnDestroy() {

  }
}
