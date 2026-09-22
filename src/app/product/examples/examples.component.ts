import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatTabChangeEvent, MatTabGroup } from '@angular/material/tabs';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ContentExamples } from 'src/app/shared/_models/content-examples';
import { Example } from 'src/app/shared/_models/example';
import { Page } from 'src/app/shared/_models/page';
import { ProductType } from 'src/app/shared/_models/product-type.enum';

import { PageType } from '../../shared/_models/page-type.enum';
import { ProductService } from '../_services/product.service';

declare var $: any;

@Component({
  selector: 'app-examples',
  templateUrl: './examples.component.html',
  styleUrls: ['./examples.component.scss']
})
export class ExamplesComponent implements OnInit, OnDestroy {
  pageType: PageType = PageType.Examples;
  productType: ProductType;
  data: Page;
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
        const tabIndex = (<ContentExamples[]>this.data.content).findIndex(obj => obj.id == data);
        this.tabGroup.selectedIndex = tabIndex > -1 ? tabIndex : 0;
      }
    });
  }

  ngOnDestroy(): void {
    (<ContentExamples[]>this.data.content).forEach(obj => {
      obj.isLoaded = false;
    });
  }

  onSelectedTabChange(event: MatTabChangeEvent) {
    if (!this.data.content[event.index].isLoaded) {
      this.data.content[event.index].examples.forEach((ex: Example) => ex.jsCode());
      this.data.content[event.index].isLoaded = true;
    }
    this.router.navigate(['./'], { relativeTo: this.route, fragment: this.data.content[event.index].id });
  }
}
