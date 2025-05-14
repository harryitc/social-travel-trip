---
to:  <%= angularOutputPath %>/<%= h.changeCase.kebabCase(moduleName)%>/services/<%= h.changeCase.kebabCase(moduleName)%>.service.ts
---
import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import {
  BehaviorSubject,
  EMPTY,
  Observable,
  catchError,
  debounceTime,
  lastValueFrom,
  map,
  of,
  switchMap,
  take,
  tap,
  throwError,
  finalize,
} from 'rxjs';

import { GLOBAL_CONFIG_PAGE_SIZE } from '@config/ui.const';

import { ErrorBase } from '@core/models/error.model';
import { SortOptions } from '@shared/components/zaa-sort/zaa-sort.component';

<% if (featureToGenerate.includes('Select_Row_In_List')) { %>
import { SelectedItemSharedState } from '../share-state/selected-item.share-state';
<% } %>

import { FilterModalSharedState } from '../share-state/filter-modal.share-state';
import { <%= h.changeCase.pascalCase(moduleName)%>Model } from '../models/<%= h.changeCase.kebabCase(moduleName)%>.model';
import { FEAUTRE_MODULES_APIS } from '../<%= h.changeCase.kebabCase(moduleName)%>.config';

@Injectable({
  providedIn: 'root',
})
export class <%= h.changeCase.pascalCase(moduleName)%>Service {
  filterState = inject(FilterModalSharedState);
  <% if (featureToGenerate.includes('Select_Row_In_List')) { %>
  selectedItemState = inject(SelectedItemSharedState);
  <% } %>
  // danh sach Product
  private <%= h.changeCase.camelCase(moduleName)%>Model:<%= h.changeCase.pascalCase(moduleName)%>Model = new <%= h.changeCase.pascalCase(moduleName)%>Model();
  private <%= h.changeCase.camelCase(moduleName)%>Display = new BehaviorSubject<Array<<%= h.changeCase.pascalCase(moduleName)%>Model> | null>(null);
  public <%= h.changeCase.camelCase(moduleName)%>$: Observable<Array<<%= h.changeCase.pascalCase(moduleName)%>Model> | null> = this.<%= h.changeCase.camelCase(moduleName)%>Display.asObservable();

  // so luong record
  private readonly totalRecord = new BehaviorSubject<number>(0);
  public readonly totalRecord$ = this.totalRecord.asObservable();

  // flag đánh dấu dữ liệu list có sự thay đổi
  private observerDataChanged: boolean = true;
  public useDataInObserver: boolean = false;

  // Api path to call api server for this bussiness logic.,
  API_ENDPOINTs = {
    <% if (featureToGenerate.includes('Create_One')) { %>
    CREATE: FEAUTRE_MODULES_APIS.CREATE,
    <% } %>  
    QUERY: FEAUTRE_MODULES_APIS.QUERY,
    <% if (featureToGenerate.includes('Fullscreen_Detail') || featureToGenerate.includes('Quick_View')) { %>
    GET_ONE_BY_ID: FEAUTRE_MODULES_APIS.GET_ONE_BY_ID,
    <% } %>
    <% if (featureToGenerate.includes('Update_One')) { %>
    UDPATE: FEAUTRE_MODULES_APIS.UDPATE,
    <% } %>  
    <% if (featureToGenerate.includes('Delete_By_Id')) { %>
    DELETE_BY_ID: FEAUTRE_MODULES_APIS.DELETE_BY_ID,
    <% } %>  
    <% if (featureToGenerate.includes('Multi_Action_Delete')) { %>   
    DELETE_MANY_BY_IDs: FEAUTRE_MODULES_APIS.DELETE_MANY_BY_IDs,
    <% } %>  

  };

  /**
   * Hàm reload dữ liệu dành riêng cho các tương tác làm thay đổi dữ liệu ở DB của product
   * Khi người dùng đứng ở một view khác, ko phải đang ở trực tiếp trên view list
   */
  setChangedData = (isChanged: boolean) => this.observerDataChanged = isChanged;

  reloadListWhenDataChanged() {
    if (this.observerDataChanged) {
      this.useDataInObserver = false;
      lastValueFrom(this.getList$().pipe(take(1)));
    }
  }

  constructor(
    private readonly httpClient: HttpClient,
  ) {
    console.log(`ProductServiceConstructor`)
  }

  private getListByFilter = (filter: any) => {
    // Trong trường hợp, list dữ liệu trước đó không có phần tử, thì lúc nào cũng sẽ bị gọi API
    // Trong trường hợp, server có data mới, thì hệ thống vẫn chưa cập nhật dữ liệu mới. Phải click search
    // Tùy theo loại nghiệp vụ. Mức độ dữ liệu thay đổi nhiều bởi các thành viên trong cùng nhóm quán lý. Cân nhắc có dùng đoạn logic này hay không.
    const useDataInObserver = this.useDataInObserver
      && this.<%= h.changeCase.camelCase(moduleName)%>Display.value
      && this.<%= h.changeCase.camelCase(moduleName)%>Display.value.length !== 0;

    if (useDataInObserver) {
      this.<%= h.changeCase.camelCase(moduleName)%>Display.next(this.<%= h.changeCase.camelCase(moduleName)%>Display.getValue());
      this.totalRecord.next(this.totalRecord.getValue());
      this.setChangedData(false);
      return of(true);
    };

    //#regions  Trích xuất thông tin từ filter để tạo request body or query param
    let requestBody: any = {
      page: GLOBAL_CONFIG_PAGE_SIZE.pageDefault + 1, // Because of page require positive
      perPage: GLOBAL_CONFIG_PAGE_SIZE.pageSizeDefault,
      filters: [],
      sorts: [],
    };
    // # The default value for the 'page' parameter sent to the server should be set to a minimum of 1.
    requestBody.page = (filter?.page || GLOBAL_CONFIG_PAGE_SIZE.pageDefault) + 1;
    requestBody.perPage = +filter?.size || GLOBAL_CONFIG_PAGE_SIZE.pageSizeDefault;

    <% if (featureToGenerate.includes('Search_By_User_Input')) { %>
    // # Additional other query example: { id:"branch", value: "vinamilk" }
    if (filter?.searchString && filter?.searchString.length !== 0) {
      requestBody.filters.push({
        id: 'searchString', // <--- Key from backend
        value: filter?.searchString,
      });
    }
    /**
    if (filter?.searchString && filter?.searchString.length !== 0) {
      requestBody.filters.push({
        id: 'otherSearchKey', // <--- Key from backend
        value: filter?.otherSearchKey,
      });
    }
    */
    <% } %>

    // # Sort is an array - Result ex: [name:asc, age:desc]
    if (filter?.sortBy && filter?.sortBy.length !== 0) {
      requestBody.sorts = (filter?.sortBy as []).map((sort: SortOptions) => sort.id);
    }

    return this.httpClient
      .post<any>(this.API_ENDPOINTs.QUERY, requestBody).pipe(
        tap((response) => {
          const list =  this.<%= h.changeCase.camelCase(moduleName)%>Model.mapArray(response?.list ?? []);
          this.<%= h.changeCase.camelCase(moduleName)%>Display.next(list);
          this.totalRecord.next(response?.total ?? 0);
        }),
        catchError((error: ErrorBase) => {
          console.log(error);
          this.<%= h.changeCase.camelCase(moduleName)%>Display.next([]);
          this.totalRecord.next(0);
          return EMPTY
        }),
        finalize(() => {
          this.setChangedData(false);
        })
      );
  };

  // concat stream data from share state -> get list product follow filter. 
  getList$() {
    // có shared state;
    return this.filterState.getState().pipe(
      debounceTime(500), 
      switchMap((shareData) => {
        return this.getListByFilter(shareData);
      })
    );
  }
  <% if (featureToGenerate.includes('Delete_By_Id')) { %>
  // Delete one record by Id
  deleteById(<%= idField[0]%>: number|string) {
    const path = this.API_ENDPOINTs.DELETE_BY_ID + `?<%= idField[0]%>=${<%= idField[0]%>}`;
    return this.httpClient.delete(path).pipe(
      tap((response) => {
        this.setChangedData(true);
      })
    );
  }
  <% } %>   

  <% if (featureToGenerate.includes('Multi_Action_Delete')) { %>   
  deleteManyByIds = (items: Array<any>) => {
    const requestBody = {
      arrayIds: items?.map((element) => element.<%= idField[0]%>)
    };
    
    return this.httpClient.post(this.API_ENDPOINTs.DELETE_MANY_BY_IDs, requestBody)
    .pipe(
      map((response) => {
      return this.<%= h.changeCase.camelCase(moduleName)%>Model.mapDeleteManyByIdsResponse(response, items); 
    })
    );
  } 
  <% } %>  
  
  


  <% if (featureToGenerate.includes('Fullscreen_Detail') || featureToGenerate.includes('Quick_View')) { %>
  // Get one record by Id
  findById(id: number|string) {
    const uri = `${this.API_ENDPOINTs.GET_ONE_BY_ID}?<%= idField[0]%>=${id}`;
    return this.httpClient.get(uri).pipe(
      map(response => new <%= h.changeCase.pascalCase(moduleName)%>Model(response)),
      catchError((error: ErrorBase) => throwError(() => error))
    );
  }
  <% } %>

  <% if (featureToGenerate.includes('Create_One')) { %>
  create = (formData: {
     <% for(var i=0; i < entityAttributes.length; i=i+2) { %>
      <%= h.changeCase.camelCase(entityAttributes[i])%>: <%= h.toTSDatatype(entityAttributes[i+1])%>;<% } %>
  }): Observable<<%= h.changeCase.pascalCase(moduleName)%>Model> => {
    const requestBody = {<% for(var i=0; i < entityAttributes.length; i=i+2) { %>
      <%= entityAttributes[i]%>: formData.<%= h.changeCase.camelCase(entityAttributes[i])%>,<% } %>
    };

    const response = this.httpClient.post<any>(this.API_ENDPOINTs.CREATE, requestBody);
    return response.pipe(
      map((response) => new <%= h.changeCase.pascalCase(moduleName)%>Model(response)),
      catchError((error: ErrorBase) => {
        return throwError(() => error);
      })
    );
  }
  <% } %>    
  <% if (featureToGenerate.includes('Update_One')) { %>
  update = (formData: {
    <%= h.changeCase.camelCase(idField[0])%>: any,
    <% for(var i=0; i < entityAttributes.length; i=i+2) { %>
    <%= h.changeCase.camelCase(entityAttributes[i])%>: <%= h.toTSDatatype(entityAttributes[i+1])%>;<% } %>
  }) => {
    const requestBody = {
      <%= idField[0]%>: formData.<%= h.changeCase.camelCase(idField[0])%>,
      <% for(var i=0; i < entityAttributes.length; i=i+2) { %>
        <%= entityAttributes[i]%>: formData.<%= h.changeCase.camelCase(entityAttributes[i])%>,<% } %>
    }

    const response = this.httpClient.put(this.API_ENDPOINTs.UDPATE, requestBody);

    return response.pipe(
      map((response) => new <%= h.changeCase.pascalCase(moduleName)%>Model(response)),
      catchError((error: ErrorBase) => {
        return throwError(() => error);
      })
    );
  }
  <% } %>  
}
