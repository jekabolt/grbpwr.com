import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Subscription } from 'rxjs';

import { AuthService } from '../../account/shared/auth.service';
import { OffcanvasService } from '../shared/offcanvas.service';

import { User } from '../../models/user.model';



@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  private authSubscription: Subscription;
  public user: User;
  public showSearch;



  constructor(
    private authService: AuthService,
    private router: Router,
    private offcanvasService: OffcanvasService
  ) {
    // const menuBtn = document.getElementById("menu_btn");
    // const sideBar = document.getElementById("side_bar");
    // const menuBtnHide = document.getElementById("menu_btn_hide");
    // menuBtn.addEventListener('click', function () {
    //   var sideBar = document.getElementById("side_bar");
    //   sideBar.classList.add("active_side_bar")
    // });

    // menuBtnHide.addEventListener('click', function () {
    //   const sideBar = document.getElementById("side_bar");
    //   sideBar.classList.remove("active_side_bar")
    // });
  }

  ngOnInit() {
    this.authSubscription = this.authService.user.subscribe((user) => {
      this.user = user;
    });
  }

  public onLogOut(e: Event) {
    this.authService.signOut();
    // this.router.navigate(['/register-login']);
    e.preventDefault();
  }

  public onMenuToggle(e: Event) {
    this.offcanvasService.openOffcanvasNavigation();
    e.preventDefault();
  }

  ngOnDestroy() {
    this.authSubscription.unsubscribe();
  }


}
