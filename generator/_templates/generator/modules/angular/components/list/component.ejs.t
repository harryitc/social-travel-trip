---
to:  <%= angularOutputPath %>/<%= h.changeCase.kebabCase(moduleName)%>/components/list/list.component.ts
---
import { Component, OnInit, OnDestroy, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ActivatedRoute, Router } from "@angular/router";
import { Observable, Subject, takeUntil, filter, switchMap, tap, catchError } from "rxjs";
import { PageEvent } from "@angular/material/paginator";
import { NgbModal } from "@shared/components/lib-ng/lib-ng-bootstrap/modal/modal";
import { ZaaNotFoundDataComponent } from "@shared/components/app-not-found-data/standalone/zaa-not-found-data/zaa-not-found-data.component";

<% if (featureToGenerate.includes('Select_Row_In_List')) { %>
import { ComponentCheckBoxHelper } from "@shared/components/zaa-check-box/app-check-box.helper";
import { AppCheckBoxComponent } from "@shared/components/zaa-check-box/app-check-box.component";
<% } %> 
import { TranslocoModule, TranslocoService } from "@ngneat/transloco";
import { MatPaginatorModule } from "@shared/components/lib-material/paginator";
import { BootBoxStandaloneComponent } from "@shared/components/zaa-bootbox/standalone/zaa-bootbox-standalone/zaa-bootbox-standalone.component";

import { SortOptions, ZaaSortComponent } from "@shared/components/zaa-sort/zaa-sort.component";
import { <%= h.changeCase.pascalCase(moduleName)%>Service } from "../../services/<%= h.changeCase.kebabCase(moduleName)%>.service";
import { <%= h.changeCase.pascalCase(moduleName)%>Model } from "../../models/<%= h.changeCase.kebabCase(moduleName)%>.model";
import { IModalFilterSharedState } from "../../share-state/filter-modal.share-state";
<% if (featureToGenerate.includes('Filter_Modal') || featureToGenerate.includes('Search_By_User_Input')) { %>
import { <%= h.changeCase.pascalCase(moduleName)%>FilterComponent } from "../filter/filter.component";
 <% } %>
<% if (featureToGenerate.includes('Create_One')) { %>
import { Create<%= h.changeCase.pascalCase(moduleName)%>Component } from "../create/create.component";
<% } %>  
<% if (featureToGenerate.includes('Quick_View')) { %>
import { QuickViewComponent } from "../detail/quick-view/quick-view.component";
<% } %>  
<% if (featureToGenerate.includes('Fullscreen_Detail')) { %>
import { FULLSCREEN_MODAL_ROUTING } from "../../<%= h.changeCase.kebabCase(moduleName)%>.routing.module";
<% } %>  

<% if (featureToGenerate.includes('Update_One')) { %>
import { Update<%= h.changeCase.pascalCase(moduleName)%>Component } from "../update/update.component";
<% } %>  
import { LANGUAGE, SORT_OPTIONS } from "../../<%= h.changeCase.kebabCase(moduleName)%>.config";
import { ZaaBreadcumbComponent } from '@shared/components/zaa-breadcumb/zaa-breadcumb.component';
import { OtherToolComponent } from "../tools/tools.component";

import _ from "lodash";
import Swal from 'sweetalert2';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    TranslocoModule,
    MatPaginatorModule,
    <% if (featureToGenerate.includes('Select_Row_In_List')) { %>
    AppCheckBoxComponent,
    <% } %> 
    ZaaNotFoundDataComponent,
    BootBoxStandaloneComponent,
    ZaaSortComponent,
    <% if (featureToGenerate.includes('Filter_Modal') || featureToGenerate.includes('Search_By_User_Input')) { %>
    <%= h.changeCase.pascalCase(moduleName)%>FilterComponent,
    <% } %>
    ZaaBreadcumbComponent,
    OtherToolComponent,
  ],
  providers: [],
  selector: 'app-<%= h.changeCase.kebabCase(moduleName)%>-list',
  templateUrl: './list.component.html',
})
export class <%= h.changeCase.pascalCase(moduleName)%>ListComponent implements OnInit, OnDestroy {
  router = inject(Router);
  route = inject(ActivatedRoute);
  modalService = inject(NgbModal);
  translatedService = inject(TranslocoService);
  <%= h.changeCase.camelCase(moduleName)%>Service = inject(<%= h.changeCase.pascalCase(moduleName)%>Service);

  destroy$$ = new Subject<void>();

  LANGUAGE_PATH = LANGUAGE;

  // #region Khai báo variable
  displayList$!: Observable<Array<<%= h.changeCase.pascalCase(moduleName)%>Model> | any>;

  // #region config paging
  pageIndex!: number | undefined;
  pageSize!: number | undefined;
  totalRecord$!: Observable<number> | null;
  // #endregion config paging

  showLoading: boolean = true;

  <% if (featureToGenerate.includes('Select_Row_In_List')) { %>
  // CheckBox variable in component:
  checkBox = new ComponentCheckBoxHelper<<%= h.changeCase.pascalCase(moduleName)%>Model>('<%= idField[0]%>');
  <% } %>
  // Sort
  currentSortId = new Array<SortOptions>;
  sortOptions: Array<SortOptions> =  SORT_OPTIONS;


  //#endregion
  ngOnDestroy(): void {
    this.destroy$$.next();
    this.destroy$$.complete();
  }

  //#region Method overide
  ngOnInit() {
    this.<%= h.changeCase.camelCase(moduleName)%>Service.useDataInObserver = true;

    const { page, size, sortBy } = this.<%= h.changeCase.camelCase(moduleName)%>Service.filterState.getCurrentValue() as IModalFilterSharedState;
    this.pageIndex = page;
    this.pageSize = size;
    this.currentSortId = sortBy;

    // Lắng nghe sự thay đổi trong Subject
    this.displayList$ = this.<%= h.changeCase.camelCase(moduleName)%>Service.<%= h.changeCase.camelCase(moduleName)%>$;
    this.totalRecord$ = this.<%= h.changeCase.camelCase(moduleName)%>Service.totalRecord$;

    // Sự kiện filter push state qua => Hiển thị loading
    this.<%= h.changeCase.camelCase(moduleName)%>Service.filterState.getState()
      .pipe(takeUntil(this.destroy$$))
      .subscribe({
        next: (state) => {
          this.showLoading = true;
          this.pageIndex = state?.page;
          this.pageSize = state?.size;
        },
      });

    // #region Thiết lập các subcription
    // kích hoạt load dữ liệu danh sách product khi vừa vào page
    this.<%= h.changeCase.camelCase(moduleName)%>Service.getList$()
      .pipe(takeUntil(this.destroy$$))
      .subscribe({
        next: (value) => {
          this.<%= h.changeCase.camelCase(moduleName)%>Service.useDataInObserver = false;
          <% if (featureToGenerate.includes('Select_Row_In_List')) { %>
          this.checkBox.refreshCheckBox();
          this.<%= h.changeCase.camelCase(moduleName)%>Service.selectedItemState.setState({ items: [] });
          <% } %>
        },
      });

    this.displayList$
      .pipe(takeUntil(this.destroy$$),
        filter((value) => value !== null)
      ).subscribe({
        next: (value) => {
          if (!this.<%= h.changeCase.camelCase(moduleName)%>Service.useDataInObserver) {
            <% if (featureToGenerate.includes('Select_Row_In_List')) { %>
            this.checkBox.refreshCheckBox();
            this.<%= h.changeCase.camelCase(moduleName)%>Service.selectedItemState.setState({ items: [] });
            <% } %>
          }
          this.showLoading = false;
        },
      })

    //#endregion
  }
  //#endregion
  <% if (featureToGenerate.includes('Delete_By_Id')) { %>
  //#region Tương tác trên table product
  showConfirmDelete = () => {
    this.LANGUAGE_PATH.list.delete.confirmTitle;
    this.LANGUAGE_PATH.list.delete.description;
    return combineLatest([
      this.translatedService.selectTranslate(
        this.LANGUAGE_PATH.list.delete.confirmTitle
      ),
      this.translatedService.selectTranslate(
        this.LANGUAGE_PATH.list.delete.description
      ),
    ]).pipe(
      switchMap(([title, desc]) =>
        from(
          Swal.fire({
            icon: 'question',
            title: title,
            text: desc,
            showCancelButton: true,
            confirmButtonText: 'OK',
            cancelButtonColor: '#d33',
            confirmButtonColor: '#3085d6',
          })
        )
      )
    );
  };

  onDeleteById = (id: number | string) => {
    const { deleteSuccessMessage, deleteFailureMessage } =
      this.LANGUAGE_PATH.list.delete;

    from(this.showConfirmDelete())
      .pipe(
        filter((value) => value.isConfirmed),
        switchMap(() => this.<%= h.changeCase.camelCase(moduleName)%>Service.deleteById(id)),
        switchMap(() =>
          this.translatedService.selectTranslate(deleteSuccessMessage)
        ),
        tap((value) => Swal.fire('', value, 'success')),
        tap(() => {
          this.showLoading = true;
          this.<%= h.changeCase.camelCase(moduleName)%>Service.setChangedData(true);
          this.<%= h.changeCase.camelCase(moduleName)%>Service.reloadListWhenDataChanged();
        }),
        catchError((error) => {
          return this.translatedService
            .selectTranslate(deleteFailureMessage)
            .pipe(tap((value) => Swal.fire('', value, 'error')));
        })
      )
      .subscribe();
  };
  <% } %>  

  //#endregion

  // #region phan trang
  // set thong tin paging xuong share data.... hệ thống sẽ tự reload list
  onHandlePageEvent(e: PageEvent) {
    this.<%= h.changeCase.camelCase(moduleName)%>Service.filterState.setStateByObject({
        'size': e.pageSize,
        'page': e.pageIndex
    });
    this.<%= h.changeCase.camelCase(moduleName)%>Service.filterState.pushStateToSubscriber();
  }
  // #endregion

  // #region other
  onClickedRow(data: any) {
    const currentSelectionId = data.id;
    this.router.navigate([{ outlets: { modal: ['product-modal', currentSelectionId] } }], {
      relativeTo: this.route,
      queryParams: { tab1: 'tong-quat-tab', tab2: 'phan-loai' },
      queryParamsHandling: 'merge',
    });
  }

  <% if (featureToGenerate.includes('Select_Row_In_List')) { %>
  // #region check box
  checkboxChange(checked: boolean, item: <%= h.changeCase.pascalCase(moduleName)%>Model) {
    this.checkBox.handleOneChecked(checked, item.<%= idField[0]%>, item);
    this.pushSelectedItemToState();
  }

  onCheckAllItems(checked: boolean, item: <%= h.changeCase.pascalCase(moduleName)%>Model[]) {
    this.checkBox.handleCheckAllItems(checked, item);
    this.pushSelectedItemToState();
  }

  pushSelectedItemToState = () => {
    this.<%= h.changeCase.camelCase(moduleName)%>Service.selectedItemState.setState({
      items: this.checkBox.getArraySelected() as any
    });
  }
  // #endregion check box
  <% } %>  

  // # sort
  onSortChange(event$: Array<SortOptions>) {
    this.<%= h.changeCase.camelCase(moduleName)%>Service.filterState.setStateByObject({'sortBy': event$ as []});
    this.<%= h.changeCase.camelCase(moduleName)%>Service.filterState.pushStateToSubscriber();
  }

  <% if (featureToGenerate.includes('Create_One')) { %>
  onShowCreateModal() {
    this.modalService.open(Create<%= h.changeCase.pascalCase(moduleName)%>Component, {
      keyboard: true,
      backdrop: "static",
    });
  }
  <% } %>  
  <% if (featureToGenerate.includes('Update_One')) { %>
 // Open modal update info one record. 
  onUpdateModal(item: any) {
     const modalRef = this.modalService.open(Update<%= h.changeCase.pascalCase(moduleName)%>Component, {
       keyboard: true,
       backdrop: "static",
     });
     modalRef.componentInstance.item = item;
  }
  <% } %>  
  <% if (featureToGenerate.includes('Quick_View')) { %>
  onQuickView(item: any) {
    const modalRef = this.modalService.open(QuickViewComponent, { size: "lg", });
    modalRef.componentInstance.item = item;
  }
  <% } %>

  <% if (featureToGenerate.includes('Fullscreen_Detail')) { %>
  onOpenDetailFullscreen(item: any) {
    this.router.navigate(
      [{ outlets: { fullscreen: [FULLSCREEN_MODAL_ROUTING.DETAILS_ROUTE, item.category_id] } }],
      {
        relativeTo: this.route,
        queryParams: {
          activeTab: FULLSCREEN_MODAL_ROUTING.ACTIVE_TABS.DISPLAY_TAB_GENERAL_INFO,
          activeSession: "phan-loai"
        },
        queryParamsHandling: 'merge',
      }
    );
  }
 <% } %>  
}