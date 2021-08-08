import {Component, OnDestroy, OnInit} from '@angular/core';

import {OffcanvasService} from '../shared/offcanvas.service';




@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  public showSearch;
  constructor(
    private offcanvasService: OffcanvasService
  ) {

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
