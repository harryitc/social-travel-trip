---
to:  <%= angularOutputPath %>/<%= h.changeCase.kebabCase(moduleName)%>/components/detail/full-screen/modal.component.scss
---
 <% if (featureToGenerate.includes('Fullscreen_Detail')) { %>
.nav-tabs-clean,
.nav-tabs-clean .nav-item .nav-link{
  height: 38px;
}
 <% } %>  
