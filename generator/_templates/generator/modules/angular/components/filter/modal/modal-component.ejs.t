---
to:  <%= angularOutputPath %>/<%= h.changeCase.kebabCase(moduleName)%>/components/filter/modal/modal.component.ts
---
<% if (featureToGenerate.includes('Filter_Modal')) { %>
import { CommonModule } from "@angular/common";
import { Component, OnInit, OnDestroy, inject} from "@angular/core";
import { MatMenuModule } from "@angular/material/menu";
import { 
    Subject, 
    takeUntil, 
} from "rxjs";
import { TranslocoModule, TranslocoService } from "@ngneat/transloco";

import { AppCheckBoxComponent } from "@shared/components/zaa-check-box/app-check-box.component";
import { IGroupButton, ZaaGroupButtonComponent } from "@shared/components/zaa-group-button/zaa-group-button.component";
import { FilterService } from "../filter-service.service";
import { IModalFilterSharedState } from "../../../share-state/filter-modal.share-state";
import { LANGUAGE } from "../../../<%= h.changeCase.kebabCase(moduleName)%>.config";

import _ from "lodash";

@Component({
  standalone: true,
  imports: [
    CommonModule,
    MatMenuModule,
    TranslocoModule,
    AppCheckBoxComponent,
    ZaaGroupButtonComponent,
  ],
  providers: [],
  selector: 'app-<%= h.changeCase.kebabCase(moduleName)%>-filter-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class FiltersModalComponent implements OnInit, OnDestroy {
  service = inject(FilterService);
  
  // Biến này để unsubcribe các observable when component destroy:
  private readonly destroy$$ = new Subject<void>();
  
  LANGUAGE_PATH = LANGUAGE;

  // Example filter. 
  groupButtonOptions: Array<IGroupButton> = [
    {
      id: '0',
      displayText: 'Tất cả',
      icon: 'fal fa-box-full',
    },
    {
      id: 'active',
      displayText: 'Đang kích hoạt',
      icon: 'fal fa-box-check',
      metadata: ''
    },
    {
      id: 'inactive',
      displayText: 'Chưa kích hoạt',
      icon: 'fal fa-box',
    },
    {
      id: '3',
      displayText: 'Hết hàng',
      icon: 'fal fa-box-alt',
    }
  ]

  DEFAULT_STATUS = {
    id: '0',
    displayText: 'Tất cả',
    icon: 'fal fa-box-full',
  };
  currentSelectedOptions: Array<IGroupButton> = [];

  // #ENDREGION Khai báo các biến cần thiết dùng cho component:
  //#REGION Các thủ tục chạy đầu tiên

  ngOnInit() {
    this.initCurrentSelectedStatus();
  }

  initCurrentSelectedStatus() {
    return this.service.shareState.getState()
      .pipe(
        takeUntil(this.destroy$$),
      ).subscribe({
        next: (state: IModalFilterSharedState | null) => {
          if (state && state?.status?.length !== 0) {
            this.currentSelectedOptions = state.status;
          } else {
            this.currentSelectedOptions = [this.DEFAULT_STATUS];
          }
        },
      });
  }

  ngOnDestroy(): void {
    this.destroy$$.next();
    this.destroy$$.complete();
  }
  //#ENDREGION Các thủ tục chạy đầu tiên

  // #REGION các tương tác với component
  onSatusChange($event: Array<IGroupButton>) {
    this.currentSelectedOptions = $event;
  }

  onCloseMenu(): void {
    // Nếu hàm reset form đã gọi nhưng không gọi hàm filter thì gán lại các giá trị trước khi thay đổi
    // Delay time để  khi form ẩn rồi mới thực hiện task này
    setTimeout(() => {
      const currentValueInShareState =
        this.service.shareState.getCurrentValue() as IModalFilterSharedState;

      const {
        status,
      } = currentValueInShareState;

      this.currentSelectedOptions = status;
    }, 100);
  }

  /**
   * Bỏ chọn tất cả thôi chứ vẫn còn giữ cái state cho đến khi bấm cái nút
   */
  onEmptyAllSelection = () => {
    // reset selction;
    this.currentSelectedOptions = [this.DEFAULT_STATUS];
  }

  onFilter = () => {
    this.service.applyFilter(
      this.currentSelectedOptions,
    );
  };

  // #ENDREGION các tương tác với component
}
<% } %>
