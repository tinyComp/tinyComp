import { Pipe, PipeTransform } from '@angular/core';
import { MenuGroup } from '../_models/menu-group';
import { MenuItem } from '../_models/menu-item';

@Pipe({
  name: 'menuItemFilter'
})
export class MenuItemPipe implements PipeTransform {

  transform(items: MenuItem[], filter: MenuGroup): unknown {
    if (!items || !filter) {
      return items;
    }

    return items.filter(item => item.group == filter);
  }

}
