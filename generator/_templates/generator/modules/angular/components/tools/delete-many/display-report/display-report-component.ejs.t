---
to:  <%= angularOutputPath %>/<%= h.changeCase.kebabCase(moduleName)%>/components/tools/delete-many/display-report/display-report.component.ts
---
import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'app-display-report',
  templateUrl: './display-report.component.html',
})
export class DisplayReportComponent implements OnInit {
  @Input() errorItems: Array<any> = [];
  @Input() successItems: Array<any> = [];
  
  DEFAULT_VISIBLE_ELEMENT_COUNT = 2;
  errorItemsVisibleCount = this.DEFAULT_VISIBLE_ELEMENT_COUNT;

  constructor() {}

  ngOnInit() {}

  showMoreError() {
    this.errorItemsVisibleCount += this.DEFAULT_VISIBLE_ELEMENT_COUNT;
  }
}
