import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProductComponent } from './product/product.component';
import { FeaturesComponent } from './features/features.component';
import { DocsComponent } from './docs/docs.component';
import { ExamplesComponent } from './examples/examples.component';
import { ChangeLogsComponent } from './change-logs/change-logs.component';
import { ProductType } from '../shared/_models/product-type.enum';


const routes: Routes = [
  {
    path: 'glasscase-jquery-image-zoom-plugin', component: ProductComponent, data: { productType: ProductType.GlassCase }, children: [
      { path: 'features', component: FeaturesComponent },
      { path: 'examples', component: ExamplesComponent },
      { path: 'documentation', component: DocsComponent },
      { path: 'changelog', component: ChangeLogsComponent },
      { path: '', redirectTo: 'features'}
    ]
  },
  {
    path: 'overbox-jquery-image-video-lightbox-plugin', component: ProductComponent, data: { productType: ProductType.OverBox }, children: [
      { path: 'features', component: FeaturesComponent },
      { path: 'examples', component: ExamplesComponent },
      { path: 'documentation', component: DocsComponent },
      { path: 'changelog', component: ChangeLogsComponent },
      { path: '', redirectTo: 'features'}
    ]
  },
  {
    path: 'sol-jquery-carousel-plugin', component: ProductComponent, data: { productType: ProductType.SolCarousel }, children: [
      { path: 'features', component: FeaturesComponent },
      { path: 'examples', component: ExamplesComponent },
      { path: 'documentation', component: DocsComponent },
      { path: 'changelog', component: ChangeLogsComponent },
      { path: '', redirectTo: 'features'}
    ]
  },
  {path: '', redirectTo: 'glasscase-jquery-image-zoom-plugin'}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductRoutingModule { }
