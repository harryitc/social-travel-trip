---
to:  <%= angularOutputPath %>/<%= h.changeCase.kebabCase(moduleName)%>/components/list/list.component.html
---

<app-zaa-breadcumb
    [breadcumbs]="[
    this.LANGUAGE_PATH.list.breadcrumb.breadcrumbItem1,
    this.LANGUAGE_PATH.list.breadcrumb.breadcrumbItem2,
    this.LANGUAGE_PATH.list.breadcrumb.breadcrumbItem3,
    ]"
    [activeIndex]="2"
    [enableLanguage]="true"
></app-zaa-breadcumb>

<div class="subheader" *transloco="let translated">
  <h1 class="subheader-title">
       <i class="subheader-icon fal fa-table"></i> 
       {{translated(this.LANGUAGE_PATH.list.title.featureName) }} 
       <span class="fw-300">
       {{translated(this.LANGUAGE_PATH.list.title.featureDesc) }}
       </span>
  </h1>
</div>

<div class="row" *transloco="let translated">
  <div class="col-xl-12">
    <div class="panel">
      <div class="panel-container show">
        <div class="panel-content">
          <div class="row mb-3">
            <!-- Filter -->
          <% if (featureToGenerate.includes('Filter_Modal') || featureToGenerate.includes('Search_By_User_Input')) { %>
            <div class="col-12 col-md-8 col-xl-5">
              <app-<%= h.changeCase.kebabCase(moduleName) %>-filter></app-<%= h.changeCase.kebabCase(moduleName) %>-filter>
            </div>
            <% } %>
          </div>
          <!-- action -->
          <div class="row mb-3">
            <!-- left -->
            <div class="col-sm-12 col-md-6 d-flex align-items-center justify-content-start">
              <% if (featureToGenerate.includes('Create_One')) { %>
              <button type="button" 
                      class="btn btn-primary text-capitalize mr-2" 
                      (click)="onShowCreateModal()">
                <i class="fal fa-plus mr-1"></i>
                {{ translated(this.LANGUAGE_PATH.list.table.createButton)}}
              </button>
              <% } %>  
              <div class="mr-3 ml-2" style="height: 30px; width: 1px; border-right: 1px solid #cdcdcd;"></div>
              <app-other-tool />
            </div>

            <!-- right -->
            <div class="col-sm-12 col-md-6 d-flex align-items-center justify-content-end">
              <mat-paginator (page)="onHandlePageEvent($event)"
                             [length]="totalRecord$ | async"
                             [pageIndex]="this.pageIndex"
                             [pageSize]="this.pageSize"
                             [hidePageSize]="true"
                             aria-label="choose-page-size">
              </mat-paginator>
              <app-zaa-sort [options]="sortOptions"
                            [currentOptionsId]="currentSortId"
                            (choose)="this.onSortChange($event)"
                            [allowMany]="false"
                            [enableLanguage]="true">
              </app-zaa-sort>
            </div>
          </div>

          <!-- table -->
          <div class="row">
            <div class="col-12">
              <div class="w-100">
                <div class="loading-frame-wrap">
                  @if(this.showLoading) {
                  <div class="loading-overlay"></div>
                  }
                  <table class="table table-hover m-0" *ngIf="this.displayList$ | async as list; ">
                    <thead class="thead-themed">
                      <tr>
                        <% if (featureToGenerate.includes('Select_Row_In_List')) { %>
                        <th>
                          <app-check-box [cheched]="this.checkBox.isCheckedAll"
                                         (checkedChange)="onCheckAllItems($event, list)">
                          </app-check-box>
                        </th>
                        <% } %>
                        <% for(let i=0; i < entityAttributes.length; i=i+2) { %>
                        <th>
                          {{ translated(this.LANGUAGE_PATH.list.table.<%= h.changeCase.camelCase(entityAttributes[i])%>tHead)}}
                        </th>
                        <% } %> 
                        <th>
                        {{ translated(this.LANGUAGE_PATH.list.table.action) }}
                        </th>
                      </tr>
                    </thead>
                    @if(list.length !== 0) {
                    <tbody>
                      <tr *ngFor="let item of list">
                        <% if (featureToGenerate.includes('Select_Row_In_List')) { %>
                        <td>
                          <app-check-box
                                         [cheched]="this.checkBox.selectedItems.get(item.id) !== undefined || this.checkBox.isCheckedAll"
                                         (checkedChange)="checkboxChange($event, item)">
                          </app-check-box>
                        </td>
                        <% } %>
                        <% for(let i=0; i < entityAttributes.length; i=i+2) { %>
                            <td  <% if (featureToGenerate.includes('Quick_View')) { %>
                            (click)="onQuickView(item)" <% } %>  
                            class="cursor-pointer">{{item.<%= entityAttributes[i] %>}}</td>
                        <% } %> 
                        <td>
                        <% if (featureToGenerate.includes('Delete_By_Id')) { %>
                          <button
                            class="ml-3 btn btn-outline-danger btn-sm btn-icon waves-effect waves-themed"
                             data-bs-toggle="tooltip" 
                             data-bs-placement="top" 
                             [title]=translated(this.LANGUAGE_PATH.list.table.tooltip.delete)
                            (click)="this.onDeleteById(item.<%= idField[0]%>)"
                          >
                            <i class="fal fa-ban"></i>
                          </button>
                        <% } %>  
                        <% if (featureToGenerate.includes('Update_One')) { %>
                          <button class="btn btn-outline-primary btn-sm btn-icon waves-effect waves-themed"
                                  data-bs-toggle="tooltip" 
                                  data-bs-placement="top" 
                                  [title]=translated(this.LANGUAGE_PATH.list.table.tooltip.update)
                                  (click)="this.onUpdateModal(item)">
                            <i class="fal fa-edit"></i>
                            </button>
                        <% } %>  
                            <% if (featureToGenerate.includes('Fullscreen_Detail')) { %>
                            <button class="btn btn-default btn-sm" (click)="this.onOpenDetailFullscreen(item)">Fullscreen</button>
                            <% } %>  
                        </td>
                      </tr>
                    </tbody>
                    }
                  </table>
                  <div class="mt-2" *ngIf="this.displayList$ | async as list; ">
                      <app-zaa-not-found-data [show]="list.length == 0"></app-zaa-not-found-data>
                  </div>
                </div>
                <!-- END Display table -->
              </div>
            </div>
          </div>
          <!-- datatable end -->
        </div>
      </div>
    </div>
  </div>
</div>
