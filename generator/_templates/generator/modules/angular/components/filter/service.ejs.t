---
to:  <%= angularOutputPath %>/<%= h.changeCase.kebabCase(moduleName)%>/components/filter/filter-service.service.ts
---
<% if (featureToGenerate.includes('Filter_Modal') || featureToGenerate.includes('Search_By_User_Input')) { %>
import { Injectable, inject} from '@angular/core';
import { IGroupButton } from '@shared/components/zaa-group-button/zaa-group-button.component';
import { GLOBAL_CONFIG_PAGE_SIZE } from '@config/ui.const';
import { FilterModalSharedState } from '../../share-state/filter-modal.share-state';

@Injectable({
  providedIn: 'root'
})
export class FilterService {
  shareState = inject(FilterModalSharedState); 
  <% if (featureToGenerate.includes('Filter_Modal')) { %>
  // U can additional field to filter
  applyFilter = (status: Array<IGroupButton>) => {
    this.shareState.setStateByObject({
      status: status,
    });
    this.shareState.pushStateToSubscriber();
  };
  <% } %>

  <% if (featureToGenerate.includes('Search_By_User_Input')) { %>
  // When apply search - page must reset to default page
  applySearch = (searchString: string) => {
    this.shareState.setStateByObject({
      searchString: searchString,
      page: GLOBAL_CONFIG_PAGE_SIZE.pageDefault,
    });
    this.shareState.pushStateToSubscriber();
  };
  <% } %>
}
<% } %>
