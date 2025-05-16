---
to:  <%= angularOutputPath %>/<%= h.changeCase.kebabCase(moduleName)%>/components/detail/full-screen/tabs/info/general-info.component.ts
---
 <% if (featureToGenerate.includes('Fullscreen_Detail')) { %>
import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subject, takeUntil } from 'rxjs';
import { <%= h.changeCase.pascalCase(moduleName)%>Model } from '../../../../../<%= h.changeCase.kebabCase(moduleName)%>.model';
import { <%= h.changeCase.pascalCase(moduleName)%>Service } from '../../../../../service/<%= h.changeCase.kebabCase(moduleName)%>.service';
import { TranslocoModule, TranslocoService } from "@ngneat/transloco";
import { LANGUAGE } from "../../../../../<%= h.changeCase.kebabCase(moduleName)%>.config";

@Component({
  standalone: true,
  imports: [
    CommonModule,
    TranslocoModule
  ],
  selector: 'app-general-info',
  templateUrl: './general-info.component.html',
  styleUrls: ['./general-info.component.scss']
})
export class GeneralInfoComponent implements OnInit, OnDestroy {
  service = inject(<%= h.changeCase.pascalCase(moduleName)%>Service);
  route = inject(ActivatedRoute);
  destroy$$ = new Subject<void>();
  
  LANGUAGE_PATH = LANGUAGE;

  item!: <%= h.changeCase.pascalCase(moduleName)%>Model | null;

  ngOnInit() {
    this.service.findById(
      parseInt(this.route.snapshot.paramMap.get('<%= idField[0]%>') ?? '0'))
      .pipe(takeUntil(this.destroy$$))
      .subscribe({
        next: (value) => {
            this.item = value;
        }
      })
  }

  ngOnDestroy(): void {
    this.destroy$$.next();
    this.destroy$$.complete();
  }
}
 <% } %>  
