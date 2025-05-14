---
to:  <%= angularOutputPath %>/<%= h.changeCase.kebabCase(moduleName)%>/components/filter/item-sticky/item-sticky.model.ts
---
<% if (featureToGenerate.includes('Filter_Modal')) { %>
import _ from "lodash";

export enum ITEMSTICKY_TYPE {
  STATUS
}

export class ItemsSticky {
  id!: string;
  constructor(
    public itemValue: any,
    public itemDisplayText: string,
    public type?: ITEMSTICKY_TYPE,
  ) {
    this.id = type + _.uniqueId();
  }
}
<% } %>
