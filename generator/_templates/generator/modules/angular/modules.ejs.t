---
to:  <%= angularOutputPath %>/<%= h.changeCase.kebabCase(moduleName)%>/<%= h.changeCase.kebabCase(moduleName)%>.module.ts
---
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TranslocoModule } from '@ngneat/transloco';
import { ReactiveFormsModule } from '@angular/forms';
import { <%= h.changeCase.pascalCase(moduleName)%>RoutingModule } from './<%= h.changeCase.kebabCase(moduleName)%>.routing.module';
import { <%= h.changeCase.pascalCase(moduleName)%>Component } from './<%= h.changeCase.kebabCase(moduleName)%>.component';

@NgModule({
  declarations: [],
  providers: [],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslocoModule,
    <%= h.changeCase.pascalCase(moduleName)%>RoutingModule,
    <%= h.changeCase.pascalCase(moduleName)%>Component,
  ],
})
export class <%= h.changeCase.pascalCase(moduleName)%>Module { }
