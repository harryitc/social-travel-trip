---
to:  <%= angularOutputPath %>/<%= h.changeCase.kebabCase(moduleName)%>/components/tools/delete-many/app-other-tool-delete-many.component.ts
---
import { CommonModule } from "@angular/common";
import { Component, OnInit, inject } from '@angular/core';
import {
  delay,
  finalize,
  from,
  concatMap,
  tap,
  Subject,
  takeUntil,
} from 'rxjs';
import { NgbModal } from '@shared/components/lib-ng/lib-ng-bootstrap/modal/modal';
import { MatMenuModule } from '@angular/material/menu';
import { ToastrService } from '@shared/components/lib-ngx/ngx-toastr/toastr/toastr.service';
import { <%= h.changeCase.pascalCase(moduleName)%>Service } from "../../../services/<%= h.changeCase.kebabCase(moduleName)%>.service";
import { NgbActiveModal } from '@shared/components/lib-ng/lib-ng-bootstrap/modal/modal-ref';
import { TranslocoModule, TranslocoService } from "@ngneat/transloco";
import { LANGUAGE } from "../../../<%= h.changeCase.kebabCase(moduleName)%>.config";
import { ProcessBarOverlayComponent } from "@shared/components/zaa-processbar-overlay/processbar-overlay.component";
import { DisplayReportComponent } from "./display-report/display-report.component";
import { DisplaySelectedItemComponent } from "./display-selected-items/display-selected-items.component";

import _ from 'lodash';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    MatMenuModule,
    TranslocoModule,
    ProcessBarOverlayComponent,
    DisplayReportComponent,
    DisplaySelectedItemComponent,
  ],
  providers: [],
  selector: 'app-other-tool-delete-many',
  templateUrl: './app-other-tool-delete-many.component.html',
})
export class OtherToolDeleteManyByIdsComponent implements OnInit {
  toast = inject(ToastrService);
  activeModal = inject(NgbActiveModal);
  service = inject(<%= h.changeCase.pascalCase(moduleName)%>Service);

  destroy$$ = new Subject<void>();
  
  LANGUAGE_PATH = LANGUAGE;

  public selectedItems: Array<any> = [];
  
  waitingToExecute: boolean = false;

  showProcessBar: boolean = false;
  progressValue: number = 0; // number of item processed - not percent :)
  
  showViewSelectedItems: boolean = true;
  showViewReportTemplate: boolean = false;

  errorItems: Array<any> = [];
  successItems: Array<any> = [];
  
  ngOnInit() {
    this.service.selectedItemState
      .getState()
      .pipe(takeUntil(this.destroy$$))
      .subscribe({
        next: (value) => {
          this.selectedItems = value?.items ?? [];
        },
      });
  }

  ngOnDestroy(): void {
    this.destroy$$.next();
    this.destroy$$.complete();
  }

  onClose() {
    this.service.reloadListWhenDataChanged();
    this.activeModal.dismiss();
  }

  async onConfirm() {
    const DELAY_TIME_TO_DISPLAY_FULL_PROCESS_BAR = 500; //ms <-- Delay time to display process bar

    this.waitingToExecute = true;
    this.showProcessBar = true;

    const CHUNK_SIZE = 3; // mean: Each array have CHUNK_SIZE items
    const arrayManyItems = _.chunk(this.selectedItems, CHUNK_SIZE);

    from(arrayManyItems)
      .pipe(
        concatMap((items) => this.service.deleteManyByIds(items)),
        tap((response: any) => {
          this.progressValue +=
            response.errorRecords.length + response.successRecords.length;
        }),
        delay(DELAY_TIME_TO_DISPLAY_FULL_PROCESS_BAR),
        finalize(() => {
           if (this.successItems.length !== 0) {
             this.service.setChangedData(true);
           }
          // Update process bar - then show report view
          setTimeout(() => {
            this.showViewSelectedItems = false;
            this.showViewReportTemplate = true;
            this.waitingToExecute = false;
          }, 700);
        }),
      )
      .subscribe({
        next: (response: any) => {
          this.errorItems.push(...response.errorRecords);
          this.successItems.push(...response.successRecords);
        },
      });
  }
}
