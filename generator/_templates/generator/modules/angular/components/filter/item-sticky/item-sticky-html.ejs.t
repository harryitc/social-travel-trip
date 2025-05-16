---
to:  <%= angularOutputPath %>/<%= h.changeCase.kebabCase(moduleName)%>/components/filter/item-sticky/item-sticky.component.html
---
<% if (featureToGenerate.includes('Filter_Modal')) { %>
<div *ngIf="itemViewModel$ | async as IItemState">
  <div *ngIf="IItemState" class="mt-2 ml-1">
    @for(item of IItemState.itemsSticky; track $index) {
    <div class="btn-group btn-group-sm mt-1  ml-0">
      @for(e of item; track $index) {
      @if(e.type === ITEM_STICKY_ENUM.STATUS && $index === 0) {
        <button class="btn btn-secondary" style="cursor: default;">
          <strong *transloco="let translated">
          {{ translated(this.LANGUAGE_PATH.filter.itemSticky.status)}}:
          </strong>
        </button>
        }
      <button (click)="onRemoveItem(e)"
              type="button"
              class="btn btn-primary waves-effect waves-themed">
        {{ e.itemDisplayText }} 
      <i class="ml-1 fal fa-trash"></i>
      </button>
      } 
    </div>
    }
  </div>
</div>
<% } %>