---
to:  <%= angularOutputPath %>/<%= h.changeCase.kebabCase(moduleName)%>/share-state/selected-item.share-state.ts
---
<% if (featureToGenerate.includes('Select_Row_In_List')) { %>
import { Injectable } from '@angular/core';
import { CoreSharedState } from '@core/state/core-shared.state';

export type ISelectedItemSharedState = {
  items: any[];
};

@Injectable({
  providedIn: 'root',
})
export class SelectedItemSharedState
  extends CoreSharedState<ISelectedItemSharedState> {
  constructor() {
    super();
    this.setInitialState({
      items: []
    });
  }

  override setState(state: ISelectedItemSharedState | null): void {
    super.setState(state);
    super.pushStateToSubscriber();
  }
}
<% } %>