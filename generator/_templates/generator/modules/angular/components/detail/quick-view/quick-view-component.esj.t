---
to:  <%= angularOutputPath %>/<%= h.changeCase.kebabCase(moduleName)%>/components/detail/quick-view/quick-view.component.ts
---
<% if (featureToGenerate.includes('Quick_View')) { %>
import { CommonModule } from "@angular/common";
import { Component, Input, OnInit, inject } from '@angular/core';
import { NgbActiveModal } from '@shared/components/lib-ng/lib-ng-bootstrap/modal/modal-ref';
import { TranslocoModule, TranslocoService } from "@ngneat/transloco";
import { LANGUAGE } from "../../../<%= h.changeCase.kebabCase(moduleName)%>.config";

@Component({
  standalone: true,
  imports: [
    CommonModule,
    TranslocoModule,
  ],
  selector: 'app-quick-view',
  templateUrl: './quick-view.component.html',
  styleUrls: ['./quick-view.component.scss']
})
export class QuickViewComponent {
  @Input() item: any;

  activeModal = inject(NgbActiveModal);

  LANGUAGE_PATH = LANGUAGE;

  onCloseModal() {
    this.activeModal.dismiss('Cross click')
  }
}
<% } %>