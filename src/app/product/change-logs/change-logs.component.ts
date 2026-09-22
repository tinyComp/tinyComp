import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { PageType } from '../../shared/_models/page-type.enum';
import { ProductService } from '../_services/product.service';

@Component({
  selector: 'app-change-logs',
  templateUrl: './change-logs.component.html',
  styleUrls: ['./change-logs.component.scss']
})
export class ChangeLogsComponent implements OnInit {
  pageType: PageType = PageType.changeLogs;
  data: any = {};

  constructor(private route: ActivatedRoute,
    private productService: ProductService) { }

  ngOnInit(): void {
    this.route.parent.data.subscribe((data: Params) => {
      this.data = this.productService.getPageData(data['productType'], this.pageType);
      
      this.productService.setTitleMeta(this.data);
    });
  }
}
