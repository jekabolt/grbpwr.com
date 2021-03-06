import {Component, OnDestroy, OnInit} from '@angular/core';

import {OffcanvasService} from '../shared/offcanvas.service';

import {User} from '../../models/user.model';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  public user: User;
  public showSearch;


  constructor(
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
  }

  bgClicked() {
    console.log(11);
  }

  public onLogOut(e: Event) {
    // this.router.navigate(['/register-login']);
    e.preventDefault();
  }

  public onMenuToggle(e: Event) {
    this.offcanvasService.openOffcanvasNavigation();
    e.preventDefault();
  }

  ngOnDestroy() {
  }

}
