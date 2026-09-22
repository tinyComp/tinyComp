import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';

import { ProductRoutingModule } from './product-routing.module';
import { ProductComponent } from './product/product.component';
import { FeaturesComponent } from './features/features.component';
import { DocsComponent } from './docs/docs.component';
import { ExamplesComponent } from './examples/examples.component';
import { ChangeLogsComponent } from './change-logs/change-logs.component';


@NgModule({
  declarations: [ProductComponent, FeaturesComponent, DocsComponent, ExamplesComponent, ChangeLogsComponent],
  imports: [
    ProductRoutingModule,
    SharedModule
  ]
})
export class ProductModule { }
