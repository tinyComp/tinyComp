import { AfterViewChecked, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { ProductType } from 'src/app/shared/_models/product-type.enum';

import { PageType } from '../../shared/_models/page-type.enum';
import { ProductService } from '../_services/product.service';

declare var $: any;

@Component({
  selector: 'app-features',
  templateUrl: './features.component.html',
  styleUrls: ['./features.component.scss']
})
export class FeaturesComponent implements OnInit, AfterViewChecked {
  pageType: PageType = PageType.Features;
  productType: ProductType;
  data: any = {};
  fragment: string = null;
  gotoFragment: boolean = false;

  constructor(private route: ActivatedRoute,
    private productService: ProductService) { }

  ngOnInit(): void {
    this.route.parent.data.subscribe((data: Params) => {
      this.productType = data['productType'];
      this.data = this.productService.getPageData(this.productType, this.pageType);
      this.productService.setTitleMeta(this.data);
    });

    this.route.fragment.subscribe(data => {
      this.fragment = data;

      switch (this.productType) {
        case ProductType.GlassCase:
          $(() => {
            $('.pInstructions').hide();
            $("#girlstop1").glassCase({
              'widthDisplay': 370, 'heightDisplay': 550, 'isSlowZoom': true, 'isSlowLens': true, 'capZType': 'in',
              'thumbsPosition': 'bottom', 'colorIcons': '#fff', 'colorActiveThumb': '#000', 'colorLoading': '#43a047'
            });
          });
          break;
        case ProductType.OverBox:
          $(() => {
            $('.ob-content').overbox('.ob-content', { 'obOpenCloseType': 'obCntPush', 'isInfoEnabled': true, 'isPagEnabled': false, 'isInfiniteGroup': false });
          });
          break;
        case ProductType.SolCarousel:
          $(() => {
            $('.sCarouselIP1').solCarousel({
              'itemPanelStyle': 'style1',
              'arrowsNavStyle': 'circle',
              'slidesNavStyle': 'circleOutline',
              'colorQuickViewBtn': '#777777',
              'totalTitleLines': 1,
              'totalTextLines': 5
            });
          });
          
          break;
      }
    });
  }

  ngAfterViewChecked(): void {
    if (!this.gotoFragment && this.fragment) {
      this.gotoFragment = true;
      this.goTo(this.fragment);
    }


  }

  goTo(location: string): void {
    const el = document.getElementById(location);
    el.scrollIntoView();
  }
}
