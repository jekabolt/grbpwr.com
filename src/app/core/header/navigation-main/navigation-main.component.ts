import { Component, OnDestroy, OnInit, HostListener } from '@angular/core';

import { Router, NavigationEnd } from '@angular/router';

import { filter } from 'rxjs/operators';

import { Subscription } from 'rxjs';

import { AuthService } from '../../../account/shared/auth.service';

import { User } from '../../../models/user.model';
import {CartService} from '../../../cart/shared/cart.service';


@Component({
  selector: 'app-navigation-main',
  templateUrl: './navigation-main.component.html',
  styleUrls: ['./navigation-main.component.scss']
})
export class NavigationMainComponent implements OnInit, OnDestroy {
  public user: User;
  private authSubscription: Subscription;
  public navbarOpened = false
  public infoOpened = false


  constructor(public authService: AuthService,
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

  toggleInfo() {
    this.infoOpened = !this.infoOpened;
  }

  @HostListener('window:keydown.escape', ['$event'])
  keyEvent(event: KeyboardEvent) {
    this.hideNavbar()
  }

  ngOnInit() {
    this.authService.user.subscribe((user) => {
      this.user = user;
    });
  }

  ngOnDestroy() {
    this.authSubscription.unsubscribe();
  }
}
