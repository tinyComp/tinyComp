import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { MenuGroup } from '../_models/menu-group';
import { MenuItem } from '../_models/menu-item';
import { ProductType } from '../_models/product-type.enum';
import { UiService } from '../_services/ui.service';

@Component({
  selector: 'app-menu-overlay',
  templateUrl: './menu-overlay.component.html',
  styleUrls: ['./menu-overlay.component.scss']
})
export class MenuOverlayComponent implements OnInit {
  menuItems: MenuItem[] = [];
  menuGroups: MenuGroup[] = [];
  ccLink: string = '';

  constructor(private uiService: UiService,
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit(): void {
    this.menuItems = this.uiService.getMenuItems();
    this.menuGroups = this.uiService.getMenuGroups();

    this.route.data.subscribe((data: Params) => {
      switch (data['productType']) {
        case ProductType.GlassCase:
          this.ccLink = 'https://codecanyon.net/item/glasscase-jquery-product-image-zoom-plugin/7843419?ref=tinycomp';
          break;
        case ProductType.OverBox:
          this.ccLink = 'https://codecanyon.net/item/overbox-responsive-touch-enabled-lightbox-plugin/12092054?ref=tinycomp';
          break;
        case ProductType.SolCarousel:
          this.ccLink = 'https://codecanyon.net/item/solcarousel-jquery-carousel-plugin/32075127?ref=tinycomp';
          break;
      }
    });
  }

  navigate(group: MenuGroup, item: MenuItem): void {
    this.router.navigate([group.path, item.path]);
    this.uiService.isMenuOverlayOpen.next(false);
  }

}
