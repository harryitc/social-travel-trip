---
to:  <%= angularOutputPath %>/<%= h.changeCase.kebabCase(moduleName)%>/share-state/filter-modal.share-state.ts
---
import { Injectable } from '@angular/core';
import {
  AppStorageService,
  StorageLocation,
} from '@core/app-store/app-storage.service';
import { GLOBAL_CONFIG_PAGE_SIZE } from '@config/ui.const';
import { SortOptions } from '@shared/components/zaa-sort/zaa-sort.component';
import { CoreSharedState } from '@core/state/core-shared.state';
import { FILTER_SHARE_STATE_STORAGE_KEY } from '../<%= h.changeCase.kebabCase(moduleName)%>.config';

/**
 * Trạng thái chia sẻ bộ lọc của Modal.
 */
export type IModalFilterSharedState = {
  <% if (featureToGenerate.includes('Search_By_User_Input')) { %>
  searchString: string;
  <% } %>
  page: number;
  size: number;
  sortBy: Array<SortOptions>; 
  <% if (featureToGenerate.includes('Filter_Modal')) { %>
  status: any;
  <% } %>
  // aditional your filter value;
};

@Injectable({
  providedIn: 'root',
})
export class FilterModalSharedState
  extends CoreSharedState<IModalFilterSharedState> {
  constructor(private readonly storage: AppStorageService) {
    super();
    this.setInitialState(this.getInitedState());
  };

  storageScope = FILTER_SHARE_STATE_STORAGE_KEY;
  STORAGE_LOCATON =
    { location: StorageLocation.SESSION_STORAGE }

  setStateByObject = (updates: Partial<IModalFilterSharedState>) => {
    const currentState = this.getCurrentValue();
    if (currentState) {
      Object.assign(currentState, updates);
      this.setStateToStorage(currentState);
      this.setState(currentState);
    }
  };

  getInitedState = () => {
    const stateInStorage = this.storage.getItem<IModalFilterSharedState>(
      this.storageScope, this.STORAGE_LOCATON
    );
    if (stateInStorage) {
      return stateInStorage;
    }
    // default when empty state.
    return {
      <% if (featureToGenerate.includes('Search_By_User_Input')) { %>
      searchString: '',
      <% } %>
      page: GLOBAL_CONFIG_PAGE_SIZE.pageDefault, // 0
      size: GLOBAL_CONFIG_PAGE_SIZE.pageSizeDefault, // 10
      sortBy: [],
      <% if (featureToGenerate.includes('Filter_Modal')) { %>
      status: null,
      <% } %>
    };
  };

  setStateToStorage = (currentState: IModalFilterSharedState) => {
    this.storage.setItem(this.storageScope, currentState, this.STORAGE_LOCATON);
  };
}
