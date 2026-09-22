import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { MenuGroup } from '../_models/menu-group';
import { MenuItem } from '../_models/menu-item';

@Injectable({
  providedIn: 'root'
})
export class UiService {
  private menuGroups: MenuGroup[] = [
    {name: 'GlassCase', path: '/products/glasscase-jquery-image-zoom-plugin'},
    {name: 'OverBox', path: '/products/overbox-jquery-image-video-lightbox-plugin'},
    {name: 'SolCarousel', path: '/products/sol-jquery-carousel-plugin'}
  ];

  private menuItems: MenuItem[] = [
    {name: 'Features', path: 'features', group: this.menuGroups[0]},
    {name: 'Examples', path: 'examples', group: this.menuGroups[0]},
    {name: 'Documentation', path: 'documentation', group: this.menuGroups[0]},
    {name: 'Change Logs', path: 'changelog', group: this.menuGroups[0]},
    {name: 'Features', path: 'features', group: this.menuGroups[1]},
    {name: 'Examples', path: 'examples', group: this.menuGroups[1]},
    {name: 'Documentation', path: 'documentation', group: this.menuGroups[1]},
    {name: 'Change Logs', path: 'changelog', group: this.menuGroups[1]},
    {name: 'Features', path: 'features', group: this.menuGroups[2]},
    {name: 'Examples', path: 'examples', group: this.menuGroups[2]},
    {name: 'Documentation', path: 'documentation', group: this.menuGroups[2]},
    {name: 'Change Logs', path: 'changelog', group: this.menuGroups[2]},
  ];
  isMenuOverlayOpen = new Subject<boolean>();
  
  constructor() { }

  getMenuItems(){
    return [...this.menuItems];
  }

  getMenuGroups(){
    return [...this.menuGroups];
  }
}
