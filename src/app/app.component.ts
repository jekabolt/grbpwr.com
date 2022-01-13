import { Component, } from '@angular/core';
import {Router,ActivatedRoute,NavigationEnd} from '@angular/router';
import { filter , map, mergeMap} from 'rxjs/operators';
declare let gtag: Function;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {
  constructor(
      private router: Router,
      private activatedRoute: ActivatedRoute,
  ){}
  visible: boolean = true;

  sub: any;
  ngOnInit() {
    this.setUpAnalytics()
    this.sub = this.router.events.pipe(
              filter(events => events instanceof NavigationEnd),
              map(evt => this.activatedRoute),
              map(route => {
                  while (route.firstChild) {
                      route = route.firstChild;
                  }
                  return route;
              })).pipe(
              filter(route => route.outlet === "primary"),
              mergeMap(route => route.data))
          .subscribe(x => x.header === true ? this.visible = true : this.visible = false)
  }

  setUpAnalytics() {
    this.router.events.pipe(filter(event => event instanceof NavigationEnd))
        .subscribe((event: NavigationEnd) => {
            gtag('config', 'G-YOUR-GOOGLE-ID',
                {
                    page_path: event.urlAfterRedirects
                }
            );
    });
  } 

  ngOnDestroy() {

    if(this.sub && !this.sub.closed)
        this.sub.unsubscribe();
  }
}
