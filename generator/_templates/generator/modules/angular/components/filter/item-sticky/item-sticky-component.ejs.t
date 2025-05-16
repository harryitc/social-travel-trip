---
to:  <%= angularOutputPath %>/<%= h.changeCase.kebabCase(moduleName)%>/components/filter/item-sticky/item-sticky.component.ts
---
<% if (featureToGenerate.includes('Filter_Modal')) { %>
import { Component, OnInit, inject } from '@angular/core';
import { CoreReactiveState } from '@core/state/observable-state';

import { Observable } from 'rxjs';
import { ItemStickyService } from './item-sticky.service';
import { CommonModule } from '@angular/common';
import { ITEMSTICKY_TYPE, ItemsSticky } from './item-sticky.model';
import { TranslocoModule, TranslocoService } from "@ngneat/transloco";
import { LANGUAGE } from "../../../<%= h.changeCase.kebabCase(moduleName)%>.config";

//Khai bao cac doi tuong state su dung trong component
type ItemsStickyComponentState = {
  itemsSticky: Array<ItemsSticky[]> | never[];
};

type ViewModel = Pick<ItemsStickyComponentState, 'itemsSticky'>;

@Component({
  standalone: true,
  imports: [
    CommonModule,
    TranslocoModule
  ],
  providers: [
    ItemStickyService,
  ],
  selector: 'app-<%= h.changeCase.kebabCase(moduleName)%>-items-sticky',
  templateUrl: './item-sticky.component.html',
})
export class ItemsStickyComponent
  extends CoreReactiveState<ItemsStickyComponentState>
  implements OnInit {

  itemStickyService = inject(ItemStickyService);
  
  ITEM_STICKY_ENUM = ITEMSTICKY_TYPE;
  LANGUAGE_PATH = LANGUAGE;

  constructor() {
    super();
  }

  public readonly itemViewModel$: Observable<ViewModel> =
    this.onlySelectWhen(['itemsSticky']);

  ngOnInit() {
    // khoi tao gia tri ban dau
    this.initialize({ itemsSticky: [] });

    // thiet lap ket noi den cac state can thiet
    this.connect({
      itemsSticky: this.itemStickyService.filterStateThenUpdateItemSticky$
    });
  }

  /**
   * Xóa một ItemsSticky khỏi danh sách.
   * @param item Mục dán cần xóa.
   * cap nhat tren state cua component (Vi state cua component dang la bang anh xa cua itemsSticky$ duoi service.
   * nen moi thay doi duoi service se tu ap dung tren component)
   * ap dung xuong service
   */
  onRemoveItem = (item: any) => {
    this.itemStickyService.removeSticky(item);
  };
}
<% } %>
