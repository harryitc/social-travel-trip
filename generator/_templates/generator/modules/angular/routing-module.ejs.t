---
to:  <%= angularOutputPath %>/<%= h.changeCase.kebabCase(moduleName)%>/<%= h.changeCase.kebabCase(moduleName)%>.routing.module.ts
---

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { <%= h.changeCase.pascalCase(moduleName)%>Component } from './<%= h.changeCase.kebabCase(moduleName)%>.component';
import { <%= h.changeCase.pascalCase(moduleName)%>ListComponent } from './components/list/list.component';
<% if (featureToGenerate.includes('Fullscreen_Detail')) { %>

import { <%= h.changeCase.pascalCase(moduleName)%>FullScreenComponent } from './components/detail/full-screen/modal.component';
<% } %>  
<% if (featureToGenerate.includes('Fullscreen_Detail')) { %>
// Nơi khai báo các đường dẫn liên quan đến các chuyển hướng đến modal theo kiểu routing
export const FULLSCREEN_MODAL_ROUTING = {
  PARENT_ROUTE: '',

  // E.g: http://domain/.../chi-tiet/[your-info-id]?activeTab=thong-tin
  DETAILS_ROUTE: 'chi-tiet',
  ACTIVE_TABS: {
    DISPLAY_TAB_GENERAL_INFO: 'thong-tin',
    DISPLAY_TAB_OTHER_INFO: 'thong-tin-khac'
  },
}
<% } %>  
@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild([
    {
        path: '', 
        component: <%= h.changeCase.pascalCase(moduleName)%>Component,
        children: [
            // Route to display list component
            {
                path: '',
                component: <%= h.changeCase.pascalCase(moduleName)%>ListComponent,
            },
            <% if (featureToGenerate.includes('Fullscreen_Detail')) { %>
            // Route to display modal full screen,
            {
                path: FULLSCREEN_MODAL_ROUTING.DETAILS_ROUTE + '/:<%= idField[0]%>',
                component: <%= h.changeCase.pascalCase(moduleName)%>FullScreenComponent,
                outlet: 'fullscreen',
            },
            <% } %>  
        ]
  },
    ]),
  ],
  exports: [RouterModule]
})
export class <%= h.changeCase.pascalCase(moduleName)%>RoutingModule { }
