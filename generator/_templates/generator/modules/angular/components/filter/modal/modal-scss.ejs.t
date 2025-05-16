---
to:  <%= angularOutputPath %>/<%= h.changeCase.kebabCase(moduleName)%>/components/filter/modal/modal.component.scss
---
<% if (featureToGenerate.includes('Filter_Modal')) { %>
::ng-deep .filter-material-menu {
  width: 40rem;
}

// Disable style material menu
::ng-deep .mat-mdc-menu-panel {
  max-width: none !important;
}
<% } %>