---
to:  <%= angularOutputPath %>/<%= h.changeCase.kebabCase(moduleName)%>/components/filter/filter.component.ts
---
<% if (featureToGenerate.includes('Filter_Modal') || featureToGenerate.includes('Search_By_User_Input')) { %>
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
<% if (featureToGenerate.includes('Search_By_User_Input')) { %>
import { FilterService } from './filter-service.service';
<% } %>
<% if (featureToGenerate.includes('Filter_Modal')) { %>
import { FiltersModalComponent } from './modal/modal.component';
import { ItemsStickyComponent } from './item-sticky/item-sticky.component';
<% } %>
import { TranslocoModule, TranslocoService } from "@ngneat/transloco";
import { LANGUAGE } from "../../<%= h.changeCase.kebabCase(moduleName)%>.config";


@Component({
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TranslocoModule,
    <% if (featureToGenerate.includes('Filter_Modal')) { %>
    FiltersModalComponent,
    ItemsStickyComponent,
    <% } %>
  ],
  selector: 'app-<%= h.changeCase.kebabCase(moduleName) %>-filter',
  templateUrl: './filter.component.html',
})
export class <%= h.changeCase.pascalCase(moduleName)%>FilterComponent {
  <% if (featureToGenerate.includes('Search_By_User_Input')) { %>
  service = inject(FilterService);
  searchString: string = '';

  LANGUAGE_PATH = LANGUAGE;

  ngOnInit(): void {
    this.searchString = this.service.shareState.getCurrentValue()?.searchString ?? '';
  }

  onClickSearch() {
    this.service.applySearch(this.searchString);
  }
  <% } %>
}
<% } %>
