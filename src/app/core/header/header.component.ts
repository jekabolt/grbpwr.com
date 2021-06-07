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

  }

  ngOnInit() {
  }

  bgClicked() {
  }

  ngOnDestroy() {
  }

}
