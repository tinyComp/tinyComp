import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { ErrorComponent } from './error/error.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'products', loadChildren: () => import('./product/product.module').then(m => m.ProductModule) },
  { path: 'not-found', component: ErrorComponent },
  { path: '**', redirectTo: '/' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
