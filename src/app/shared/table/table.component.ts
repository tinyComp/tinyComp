import { AfterContentInit, Component, Input, OnInit } from '@angular/core';

import { Attribute } from 'src/app/shared/_models/attribute';
import { Option } from 'src/app/shared/_models/option';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit, AfterContentInit {
  displayedColumns: string[] = [];
  displayedColumnsAttribute: string[] = ['name', 'description'];
  displayedColumnsOptions: string[] = ['name', 'description'];
  @Input() dataSource: Option[] | Attribute[] = [];
  @Input() type: 'Option' | 'Attribute';

  constructor() { }

  ngOnInit(): void {
    this.displayedColumns = this.type === 'Option' ? this.displayedColumnsOptions : this.displayedColumnsAttribute;
  }
  
  ngAfterContentInit(): void{
  }

}
