import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTabChangeEvent, MatTabGroup } from '@angular/material/tabs';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { PageType } from '../../shared/_models/page-type.enum';
import { ProductType } from '../../shared/_models/product-type.enum';
import { ProductService } from '../_services/product.service';

@Component({
  selector: 'app-docs',
  templateUrl: './docs.component.html',
  styleUrls: ['./docs.component.scss']
})
export class DocsComponent implements OnInit  {
  show: boolean = true;
  pageType: PageType = PageType.Documentation;
  productType: ProductType;
  data: any = {};
  fragment: string = null;
  @ViewChild(MatTabGroup, { static: false }) tabGroup: MatTabGroup;

  constructor(private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService) { }

  ngOnInit(): void {
    this.route.parent.data.subscribe((data: Params) => {
      this.productType = data['productType'];
      this.data = this.productService.getPageData(this.productType, this.pageType);
      this.productService.setTitleMeta(this.data);
    });

    this.route.fragment.subscribe(data => {
      if (data) {
        const tabIndex = this.data.content.findIndex(obj => obj.id == data);
        this.tabGroup.selectedIndex = tabIndex > -1 ? tabIndex : 0;
      }
    });
  }

  onSelectedTabChange(event: MatTabChangeEvent) {
    this.router.navigate(['./'], { relativeTo: this.route, fragment: this.data.content[event.index].id });
  }  
}
