import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FlexLayoutModule } from '@angular/flex-layout';

import { MaterialModule } from './material/material.module';
import { HighlightModule, HIGHLIGHT_OPTIONS } from 'ngx-highlightjs';

import { MenuComponent } from './menu/menu.component';
import { TitleBarComponent } from './title-bar/title-bar.component';
import { FooterComponent } from './footer/footer.component';
import { MenuOverlayComponent } from './menu-overlay/menu-overlay.component';
import { MenuItemPipe } from './_pipes/menu-item.pipe';
import { CodeClipboardComponent } from './code-clipboard/code-clipboard.component';
import { TableComponent } from './table/table.component';
import { SafeHtmlPipe } from './_pipes/safe-html.pipe';


@NgModule({
  declarations: [MenuComponent, TitleBarComponent, FooterComponent, MenuOverlayComponent, 
    MenuItemPipe, 
    CodeClipboardComponent, 
    TableComponent, SafeHtmlPipe],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
    HttpClientModule,
    FlexLayoutModule,
    MaterialModule,
    HighlightModule
  ],
  exports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
    HttpClientModule,
    FlexLayoutModule,
    MaterialModule,
    MenuComponent, TitleBarComponent, FooterComponent, 
    MenuOverlayComponent, 
    MenuItemPipe, 
    SafeHtmlPipe,
    CodeClipboardComponent,
    TableComponent
  ],
  providers: [
    {
      provide: HIGHLIGHT_OPTIONS,
      useValue: {
        coreLibraryLoader: () => import('highlight.js/lib/core'),
        lineNumbersLoader: () => import('highlightjs-line-numbers.js'), // Optional, only if you want the line numbers
        languages: {
          typescript: () => import('highlight.js/lib/languages/typescript'),
          javascript: () => import('highlight.js/lib/languages/javascript'),
          css: () => import('highlight.js/lib/languages/css'),
          xml: () => import('highlight.js/lib/languages/xml'),
          // html: () => import('highlight.js/lib/languages/html')
        }
      }
    }
  ]
})
export class SharedModule { }
