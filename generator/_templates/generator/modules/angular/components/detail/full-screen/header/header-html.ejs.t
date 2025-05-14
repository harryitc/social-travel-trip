---
to:  <%= angularOutputPath %>/<%= h.changeCase.kebabCase(moduleName)%>/components/detail/full-screen/header/modal-fullscreen-header.component.html
---
<% if (featureToGenerate.includes('Fullscreen_Detail')) { %>
<div class="row d-flex" *ngIf="this.item">
  Display your item: {{ this.item | json }}
</div>
 <% } %>  
