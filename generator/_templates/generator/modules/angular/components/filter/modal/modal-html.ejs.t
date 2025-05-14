---
to:  <%= angularOutputPath %>/<%= h.changeCase.kebabCase(moduleName)%>/components/filter/modal/modal.component.html
---
<% if (featureToGenerate.includes('Filter_Modal')) { %>

<button
        class="btn btn-outline-default waves-effect waves-themed"
        mat-button
        #menuTrigger="matMenuTrigger"
        [matMenuTriggerFor]="belowMenu"
        
        >
  <i class="fal fa-filter mr-1"></i>
  <span *transloco="let translated"> 
    {{translated(this.LANGUAGE_PATH.filter.title) }} 
  </span>
</button>

<mat-menu
          panelClass="filter-material-menu"
          #belowMenu="matMenu"
          yPosition="below"
          (closed)="onCloseMenu()">
  <!-- Use  $event.stopPropagation() to keep menu show when click -->
  <div class="col-md-12 m-2 filter-material-menu"
       (click)="$event.stopPropagation()">

    <!-- BEGIN SELECT 2 CATEGORY -->
      <div class="col-md-6">
        <h6 class="fw-500 fs-lg mt-2">Trạng thái:</h6>
      </div>
      <app-zaa-group-button [options]="groupButtonOptions"
                            [currentSelected]="this.currentSelectedOptions"
                            [buttonClass]="'btn btn-default waves-effect waves-themed'"
                            [allowMany]="false"
                            [enableLanguage]="false"
                            (choose)="this.onSatusChange($event)">
      </app-zaa-group-button>
    <!-- BEGIN Action button -->

    <div class="col-md-12 mt-3" *transloco="let translated">
      <div class="row mb-4">
        <div class="col-auto pr-0">
          <button type="button"
                  class="w-100 btn btn-default"
                  mat-button
                  (click)="menuTrigger.closeMenu()">
            <span>
            {{translated(this.LANGUAGE_PATH.filter.buttons.exit) }} 
            </span>
          </button>
        </div>
        <div class="col-auto">
          <button type="button"
                  class="w-100 btn btn-secondary"
                  (click)="onEmptyAllSelection()">
            <span>
            {{translated(this.LANGUAGE_PATH.filter.buttons.deselect) }} 
            </span>
          </button>
        </div>
        <div class="col">
          <button type="button"
                  class="w-100 btn btn-primary"
                  mat-button
                  (click)="onFilter(); menuTrigger.closeMenu()">
            <span>
            {{translated(this.LANGUAGE_PATH.filter.buttons.showResult) }} 
            </span>
          </button>
        </div>
      </div>
      <!-- END Action button -->
    </div>
  </div>
</mat-menu>
<% } %>