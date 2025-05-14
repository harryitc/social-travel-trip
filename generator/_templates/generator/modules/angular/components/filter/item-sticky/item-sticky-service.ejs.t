---
to:  <%= angularOutputPath %>/<%= h.changeCase.kebabCase(moduleName)%>/components/filter/item-sticky/item-sticky.service.ts
---
<% if (featureToGenerate.includes('Filter_Modal')) { %>
import _ from 'lodash';
import { map, } from 'rxjs';
import { IGroupButton } from '@shared/components/zaa-group-button/zaa-group-button.component';
import { Injectable, inject } from '@angular/core';
import { ItemsSticky, ITEMSTICKY_TYPE } from './item-sticky.model';
import { FilterModalSharedState, IModalFilterSharedState } from '../../../share-state/filter-modal.share-state';

@Injectable()
export class ItemStickyService {
  filterModalSharedState = inject(FilterModalSharedState);

  filterStateThenUpdateItemSticky$ = this.filterModalSharedState.getState()
    .pipe(map((state: IModalFilterSharedState | null) => {
      if (!state) { return []; }

      const displayItemSticky: Array<Array<any>> = [[]];

      const {
        status
      } = state;
      if (status && status.length > 0) {
        const statusItemSticky = _.map(status,
          (value: IGroupButton) => new ItemsSticky(value, value.displayText, ITEMSTICKY_TYPE.STATUS));
        displayItemSticky.push(statusItemSticky);
      }

      return displayItemSticky;
    }));

  /**
   * Cập nhật state của filter modal theo key được quy định IModalFilterState
   */
  removeSticky = (itemToRemove: ItemsSticky): void => {
    switch (itemToRemove.type) {
      case ITEMSTICKY_TYPE.STATUS:
        this.filterModalSharedState.setStateByObject({'status': ''});
        break;

      default:
        break;
    }

    this.filterModalSharedState.pushStateToSubscriber();
  };

}
<% } %>

