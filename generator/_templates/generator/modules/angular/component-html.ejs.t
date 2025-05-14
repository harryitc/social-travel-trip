---
to:  <%= angularOutputPath %>/<%= h.changeCase.kebabCase(moduleName)%>/<%= h.changeCase.kebabCase(moduleName)%>.component.html
---
<!-- Router outlet to render child component within "<%= moduleName %>" module -->
<router-outlet></router-outlet>

<% if (featureToGenerate.includes('Fullscreen_Detail')) { %>
<!-- Router outlet to render modal fulscrenn within "<%= moduleName %>" module -->
<router-outlet name="fullscreen"></router-outlet>
 <% } %>  
