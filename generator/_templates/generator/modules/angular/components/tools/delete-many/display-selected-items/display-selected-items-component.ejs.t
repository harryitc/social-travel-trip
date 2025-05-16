---
to:  <%= angularOutputPath %>/<%= h.changeCase.kebabCase(moduleName)%>/components/tools/delete-many/display-selected-items/display-selected-items.component.ts
---
import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { ZaaNotFoundDataComponent } from '@shared/components/app-not-found-data/standalone/zaa-not-found-data/zaa-not-found-data.component';

@Component({
  standalone: true,
  imports: [CommonModule, ZaaNotFoundDataComponent],
  selector: 'app-display-selected-item',
  templateUrl: './display-selected-items.component.html',
  styleUrls: ['./display-selected-items.component.scss'],
})
export class DisplaySelectedItemComponent implements OnInit {
  @Input() selectedItems: Array<any> = []; // Change ant to MODEL class
  @Input() visibleCount: number = 2;

  currentVisibleCount = this.visibleCount;
  constructor() {}

  ngOnInit() {}

  showMoreSelected() {
    this.currentVisibleCount += 2;
  }

  hideMoreSelected() {
    if (this.currentVisibleCount >= this.visibleCount) {
      this.currentVisibleCount -= 2;
    }
  }
}
