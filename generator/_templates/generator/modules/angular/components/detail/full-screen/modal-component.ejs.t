---
to:  <%= angularOutputPath %>/<%= h.changeCase.kebabCase(moduleName)%>/components/detail/full-screen/modal.component.ts
---
 <% if (featureToGenerate.includes('Fullscreen_Detail')) { %>
import { CommonModule } from '@angular/common';
import { Component, ViewChild, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { <%= h.changeCase.pascalCase(moduleName)%>Service } from '../../../services/<%= h.changeCase.kebabCase(moduleName)%>.service';
import { FULLSCREEN_MODAL_ROUTING } from '../../../<%= h.changeCase.kebabCase(moduleName)%>.routing.module';
import { NgbModal } from '@shared/components/lib-ng/lib-ng-bootstrap/modal/modal';
import { ModalFullScreenHeaderComponent } from './header/modal-fullscreen-header.component';
import { GeneralInfoComponent } from './tabs/info/general-info.component';
import { TranslocoModule, TranslocoService } from "@ngneat/transloco";
import { LANGUAGE } from "../../../<%= h.changeCase.kebabCase(moduleName)%>.config";

import _ from 'lodash';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    TranslocoModule,
    ModalFullScreenHeaderComponent,
    GeneralInfoComponent,
  ],
  providers: [],
  selector: 'app-<%= h.changeCase.kebabCase(moduleName)%>-fullscreen-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
})
export class <%= h.changeCase.pascalCase(moduleName)%>FullScreenComponent {
  @ViewChild('content', { static: true }) contentTemplate: any;

  route = inject(ActivatedRoute);
  router = inject(Router);
  modalService = inject(NgbModal);
  service = inject(<%= h.changeCase.pascalCase(moduleName)%>Service);
  
  LANGUAGE_PATH = LANGUAGE;

  MODAL_ROUTING = FULLSCREEN_MODAL_ROUTING;
  activeTab: string = this.MODAL_ROUTING.ACTIVE_TABS.DISPLAY_TAB_GENERAL_INFO;

  ngOnInit() {
    //Mở popup lên
    this.modalService.open(this.contentTemplate, {
      fullscreen: true,
      keyboard: false,
      // scrollable: true,
    });

    //Xử lý các đối số trên router truyền qua. e.g: thong-tin
    this.activeTab = this.route.snapshot.queryParams['activeTab'];
  }

  onCloseModal() {
    this.modalService.dismissAll();
    this.router.navigate([this.MODAL_ROUTING.PARENT_ROUTE , { 
      outlets: { fullscreen: null } 
    }]);
    this.service.reloadListWhenDataChanged();
  }

  onChangeTab(activeTab: string) {
    // Cập nhật query parameter mà không làm thay đổi phần còn lại của URL
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { activeTab: activeTab },
      queryParamsHandling: 'merge'
    });
  }
}

 <% } %>  
