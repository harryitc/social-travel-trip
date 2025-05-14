---
to:  <%= angularOutputPath %>/<%= h.changeCase.kebabCase(moduleName)%>/components/detail/full-screen/header/modal-fullscreen-header.component.ts
---
<% if (featureToGenerate.includes('Fullscreen_Detail')) { %>
import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { <%= h.changeCase.pascalCase(moduleName)%>Model } from '../../../../models/<%= h.changeCase.kebabCase(moduleName)%>.model';
import { <%= h.changeCase.pascalCase(moduleName)%>Service } from '../../../../services/<%= h.changeCase.kebabCase(moduleName)%>.service';

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'app-modal-fullscreen-header',
  templateUrl: './modal-fullscreen-header.component.html',
  styleUrls: ['./modal-fullscreen-header.component.scss']
})
export class ModalFullScreenHeaderComponent implements OnInit {
  service = inject(<%= h.changeCase.pascalCase(moduleName)%>Service);
  route = inject(ActivatedRoute);
  destroy$$ = new Subject<void>();

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
