---
to:  <%= angularOutputPath %>/<%= h.changeCase.kebabCase(moduleName)%>/components/filter/filter.component.html
---
<% if (featureToGenerate.includes('Filter_Modal') || featureToGenerate.includes('Search_By_User_Input')) { %>
<div class="row">
<% if (featureToGenerate.includes('Filter_Modal')) { %>
  <div class="col-auto">
      <app-<%= h.changeCase.kebabCase(moduleName)%>-filter-modal />
  </div>
<% } %>
  <% if (featureToGenerate.includes('Search_By_User_Input')) { %>
  <div class="col pl-0" *transloco="let translated">
    <div class="input-group">
      <input class="form-control" 
             [placeholder]=translated(this.LANGUAGE_PATH.filter.searchPlaceholder) 
             [(ngModel)]="searchString" 
             (keyup.enter)="onClickSearch()">
      <div class="input-group-append">
        <button class="btn btn-primary waves-effect waves-themed"
                (click)="onClickSearch()"
                type="button">
          <i class="fal fa-search"></i>
        </button>
      </div>
    </div>
  </div>
  <% } %>
</div>
<% if (featureToGenerate.includes('Filter_Modal')) { %>
<app-<%= h.changeCase.kebabCase(moduleName)%>-items-sticky />
<% } %>
<% } %>
