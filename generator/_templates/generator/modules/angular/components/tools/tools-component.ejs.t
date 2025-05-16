---
to:  <%= angularOutputPath %>/<%= h.changeCase.kebabCase(moduleName)%>/components/tools/tools.component.ts
---
import { CommonModule } from "@angular/common";
import { Component, OnInit, inject } from '@angular/core';
import { NgbModal } from '@shared/components/lib-ng/lib-ng-bootstrap/modal/modal';
import { MatMenuModule } from '@angular/material/menu';
import { ToastrService } from '@shared/components/lib-ngx/ngx-toastr/toastr/toastr.service';
import { <%= h.changeCase.pascalCase(moduleName)%>Service } from "../../services/<%= h.changeCase.kebabCase(moduleName)%>.service";
import { TranslocoModule, TranslocoService } from "@ngneat/transloco";
import { LANGUAGE } from "../../<%= h.changeCase.kebabCase(moduleName)%>.config";
import { OtherToolDeleteManyByIdsComponent } from "./delete-many/app-other-tool-delete-many.component";

@Component({
  standalone: true,
  imports: [
    CommonModule,
    MatMenuModule,
    TranslocoModule,
    OtherToolDeleteManyByIdsComponent,
  ],
  providers: [],
  selector: 'app-other-tool',
  templateUrl: './tools.component.html',
})
export class OtherToolComponent implements OnInit {
  toast = inject(ToastrService);
  modalService = inject(NgbModal);
  service = inject(<%= h.changeCase.pascalCase(moduleName)%>Service);
  languageService = inject(TranslocoService);
  LANGUAGE_PATH = LANGUAGE;

  public readonly ACTIONS = {
    DELETE_MANY_BY_IDs: "DELETE_MANY_BY_IDs",
    UPDATE_MANY_FORM: 'updateMany',
    EXPORT_EXCEL: 'exportExcel',
  };

  ngOnInit() {}

  onAction(action: string) {
    const haveDataToHandle = this.service.selectedItemState.getCurrentValue();
    if (!haveDataToHandle?.items || haveDataToHandle.items.length === 0) {
       this.languageService.selectTranslate(this.LANGUAGE_PATH.otherTools.waringMessage).subscribe({
        next: (value)=> {
          this.toast.show('', value);
        }
      })
      return;
    }

    switch (action) {
      case this.ACTIONS.DELETE_MANY_BY_IDs:
        this.modalService.open(OtherToolDeleteManyByIdsComponent, {
          size: 'lg',
          backdrop: 'static',
          keyboard: true,
        });
        break;
      case this.ACTIONS.UPDATE_MANY_FORM:
        // this.updateMany();
        break;
    }
  }
}
