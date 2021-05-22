import { Component, OnDestroy, OnInit, HostBinding } from '@angular/core';

import { Subscription } from 'rxjs';

import { AuthService } from '../../../account/shared/auth.service';

import { User } from '../../../models/user.model';


@Component({
  selector: 'app-navigation-main',
  templateUrl: './navigation-main.component.html',
  styleUrls: ['./navigation-main.component.scss']
})
export class NavigationMainComponent implements OnInit, OnDestroy {
  public user: User;
  private authSubscription: Subscription;

  @HostBinding('class.navbar-opened') navbarOpened = false;

  @HostBinding('class.menu_btn_hide') navbarOpened2 = false;

  constructor(public authService: AuthService) { }

  toggleNavbar() {
    this.navbarOpened = !this.navbarOpened;
  }

  toggleNavbar2() {
    this.navbarOpened2 = !this.navbarOpened2;
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
