import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { ProductType } from '../_models/product-type.enum';
import { UiService } from '../_services/ui.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {
  isMenuOverlayOpen: boolean = false;
  productType: ProductType;
  txtGetSources: string;

  constructor(private uiService: UiService,
              private route: ActivatedRoute,
              @Inject(DOCUMENT) private document: Document) { }

  ngOnInit(): void {
    this.uiService.isMenuOverlayOpen.subscribe(data => this.isMenuOverlayOpen = data);
    this.route.data.subscribe((data: Params) => {
      this.productType = data['productType'];
      this.txtGetSources = 'Get it from CodeCanyon';//this.productType == ProductType.SolCarousel ? 'Get it from CodeCanyon' : 'Get it from Github';
    });
  }

  showMenuOverlay() :void{
    this.isMenuOverlayOpen = !this.isMenuOverlayOpen;
    this.uiService.isMenuOverlayOpen.next(this.isMenuOverlayOpen);
  }

  onClickCC(){
    if(this.productType == ProductType.GlassCase){
      this.document.location.href = 'https://codecanyon.net/item/glasscase-jquery-product-image-zoom-plugin/7843419?ref=tinycomp';
    }
    if(this.productType == ProductType.OverBox){
      this.document.location.href = 'https://codecanyon.net/item/overbox-responsive-touch-enabled-lightbox-plugin/12092054?ref=tinycomp';
    }
    if(this.productType == ProductType.SolCarousel){
      this.document.location.href = 'https://codecanyon.net/item/solcarousel-jquery-carousel-plugin/32075127?ref=tinycomp';
    }
  }

}
