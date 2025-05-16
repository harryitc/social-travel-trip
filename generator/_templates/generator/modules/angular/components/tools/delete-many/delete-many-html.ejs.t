---
to:  <%= angularOutputPath %>/<%= h.changeCase.kebabCase(moduleName)%>/components/tools/delete-many/app-other-tool-delete-many.component.html
---
<div class="modal-header container border-bottom" *transloco="let translated">
    <h4 class="modal-title">
        <span class="mr-2">{{ translated(this.LANGUAGE_PATH.otherTools.deleteManyByIds.title)}}</span>
    </h4>
    <div class="panel-toolbar"></div>
</div>
<div
    class="modal-body container"
    *ngIf="this.selectedItems"
>
    <!-- SELECTED ITEMS -->
    @if(this.showViewSelectedItems) {
    <app-processbar-overlay
        [displayLabel]="this.LANGUAGE_PATH.otherTools.deleteManyByIds.processbarDisplayLabel"
        [processLabel]="this.LANGUAGE_PATH.otherTools.deleteManyByIds.processbarProcessLabel"
        [enableLanguage]="true"
        [showProcessBar]="this.showProcessBar"
        [total]="this.selectedItems.length"
        [progressValue]="this.progressValue">
        <app-display-selected-item [selectedItems]="this.selectedItems" />
    </app-processbar-overlay>
    }

    <!-- REPORT -->
    @if(this.showViewReportTemplate) {
      <app-display-report
      [successItems]="this.successItems"
      [errorItems]="this.errorItems" />
    }
</div>

<div class="modal-footer container border-top"  *transloco="let translated">
  <div class="container">
    <div class="row justify-content-center">
      @if(this.showViewSelectedItems) {
      <div class="col-auto">
        <button class="btn btn-default" [disabled]="this.waitingToExecute" [style.cursor]="this.waitingToExecute ? 'not-allowed':'pointer'" (click)="this.activeModal.close()">
        {{ translated(this.LANGUAGE_PATH.otherTools.deleteManyByIds.backButton)}}
        </button>
      </div>
      <div class="col-auto">
        <button class="btn btn-primary" (click)="this.onConfirm()" [disabled]="this.waitingToExecute" [style.cursor]="this.waitingToExecute ? 'not-allowed':'pointer'" >
          <span *ngIf="waitingToExecute" class="spinner-grow spinner-grow-sm mr-1" role="status" aria-hidden="true"></span>
          Tiep tuc
        {{ translated(this.LANGUAGE_PATH.otherTools.deleteManyByIds.okButton)}}
        </button>
      </div>
      }

      @if(this.showViewReportTemplate) {
          <div class="col-auto">
            <button class="btn btn-default" [disabled]="this.waitingToExecute" [style.cursor]="this.waitingToExecute ? 'not-allowed':'pointer'" (click)="this.onClose()">
              {{ translated(this.LANGUAGE_PATH.otherTools.deleteManyByIds.backButton)}}
            </button>
          </div>
      }
    </div>
  </div>
</div>