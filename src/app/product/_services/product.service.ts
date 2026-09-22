import { Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { Subject } from 'rxjs';
import { Page } from 'src/app/shared/_models/page';

import { PageType } from '../../shared/_models/page-type.enum';
import { ProductType } from '../../shared/_models/product-type.enum';
import { DataService } from './data.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  title: string = '';
  titleChanged = new Subject<string>();

  constructor(private dataService: DataService,
    private metaService: Meta,
    private titleService: Title) { }

  getPageData(productType: ProductType, pageType: PageType) {
    const productData = this.dataService.data.find(d => d.type == productType);
    const pageData = productData.pages.find(d => d.type === pageType);
    this.title = pageData.title;
    this.titleChanged.next(this.title);

    return pageData;
  }
  
  setTitleMeta(page: Page) {
    this.titleService.setTitle(page.titleHtml);
    this.metaService.updateTag({ 
      name: page.metaHtml.name, 
      content: page.metaHtml.content 
    });
  }
}
