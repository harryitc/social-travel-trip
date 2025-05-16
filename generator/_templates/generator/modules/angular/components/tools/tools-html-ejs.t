---
to:  <%= angularOutputPath %>/<%= h.changeCase.kebabCase(moduleName)%>/components/tools/tools.component.html
---
<div class="btn-group" *transloco="let translated">
  <button class="btn btn-outline-default dropdown-toggle waves-effect waves-themed" 
          type="button"
          [matMenuTriggerFor]="menuOtherTool">
    {{ translated(this.LANGUAGE_PATH.otherTools.actionButton)}}
  </button>
  <mat-menu #menuOtherTool="matMenu">
    <a class="dropdown-item cursor-pointer"
       (click)="onAction(this.ACTIONS.DELETE_MANY_BY_IDs)">
        {{ translated(this.LANGUAGE_PATH.otherTools.selects.deleteManyByIds)}}
    </a>
    <a class="dropdown-item cursor-pointer"
       (click)="onAction(this.ACTIONS.UPDATE_MANY_FORM)">
        Update many
    </a>
    <a class="dropdown-item cursor-pointer"
       (click)="onAction(this.ACTIONS.EXPORT_EXCEL)">
       Export excel
    </a>
    <div class="dropdown-divider"></div>
  </mat-menu>
</div>



