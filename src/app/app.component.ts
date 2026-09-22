import { Component } from '@angular/core';

import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
declare const gtag: Function;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'tinyComp';

  constructor(private router: Router) {
    this.router.events.pipe( filter(event => event instanceof NavigationEnd)).subscribe((event: NavigationEnd) => {
      /** START : Code to Track Page View  */
      // gtag('event', 'page_view', {
      //   page_path: event.urlAfterRedirects
      // })
      /** END */
    })
  }
}
