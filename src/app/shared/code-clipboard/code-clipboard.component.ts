import { Component, Input, OnInit } from '@angular/core';
import { Clipboard } from '@angular/cdk/clipboard';
import { MatSnackBar } from '@angular/material/snack-bar';

import { LanguageType } from '../_models/language-type.enum';

@Component({
  selector: 'app-code-clipboard',
  templateUrl: './code-clipboard.component.html',
  styleUrls: ['./code-clipboard.component.scss']
})
export class CodeClipboardComponent implements OnInit {
  @Input() value: string;
  @Input() languageType: LanguageType;

  constructor(private clipboard: Clipboard,
    private snackBar: MatSnackBar) { }
  
  ngOnInit(): void {
  }

  onCopy(value: string) {
    this.clipboard.copy(value);
    this.snackBar.open('Code copied!', '', {
      duration: 1000
    });
  }
}
