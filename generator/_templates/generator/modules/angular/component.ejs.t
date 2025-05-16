---
to:  <%= angularOutputPath %>/<%= h.changeCase.kebabCase(moduleName)%>/<%= h.changeCase.kebabCase(moduleName)%>.component.ts
---
import { Component } from "@angular/core";
import { RouterModule } from "@angular/router";

@Component({
  standalone: true,
  imports: [RouterModule],
  selector: 'app-<%= h.changeCase.kebabCase(moduleName)%>',
  templateUrl: './<%= h.changeCase.kebabCase(moduleName)%>.component.html',
})
export class <%= h.changeCase.pascalCase(moduleName)%>Component {}
