import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { Subscription } from 'rxjs';

import { UiService } from 'src/app/shared/_services/ui.service';
import { ProductService } from '../_services/product.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit, OnDestroy {
  subs: Subscription[] = [];
  title: string = '';
  isMenuOverlayOpen: boolean = false;

  @ViewChild('drawer', {static: true}) drawer: MatSidenav;
  
  constructor(private productService: ProductService,
    private cdr: ChangeDetectorRef,
    private uiService: UiService) { }

  ngOnInit(): void {
    this.subs.push(
      this.productService.titleChanged.subscribe(data => {
        this.title = data;
        this.cdr.detectChanges();
      })
    );
    
    this.subs.push(
      this.uiService.isMenuOverlayOpen.subscribe(data => {
        if(data){
          this.drawer.open();
        }else{
          this.drawer.close();
        }
      })
    );
  }
  ngOnDestroy(): void{
    this.subs.forEach(s => s.unsubscribe);
  }

  onDrawerOpenedChange(isOpen: boolean){
    if(!isOpen){
      this.uiService.isMenuOverlayOpen.next(isOpen);
    }
  }
}
