---
to:  <%= angularOutputPath %>/<%= h.changeCase.kebabCase(moduleName)%>/components/tools/delete-many/display-report/display-report.component.html
---
<div class="alert alert-primary">
  <div class="d-flex flex-fill">
    <div class="flex-fill">
      <span class="h6 mb-3">Kết quả xử lý:</span>
      <ul>
        <li>
          <span class="h6 mb-3">
            Tổng số dòng thành công:
            <strong class="font-weight-bold">
              {{ this.successItems.length }}/{{
                this.successItems.length + this.errorItems.length
              }}
            </strong>
          </span>
        </li>
        <li>
          <span class="h6">
            Tổng số dòng thất bại:
            <strong class="font-weight-bold">
              {{ this.errorItems.length }}/{{
                this.successItems.length + this.errorItems.length
              }}
            </strong>
          </span>
        </li>
      </ul>
    </div>
  </div>
</div>
<!-- REPORT -->

<!-- ERROR LIST -->
@if (this.errorItems.length !== 0) {
  <div>
    <h3 class="font-weight-bold">Danh sách dữ liệu thực thi lỗi:</h3>

    <table class="table m-0 table-striped">
      <thead>
        <tr>
          <th>#</th>
          <th>Sản phẩm</th>
          <th>Mô tả</th>
        </tr>
      </thead>
      <tbody>
        <ng-container *ngFor="let item of this.errorItems; let i = index">
          <tr *ngIf="i < this.errorItemsVisibleCount">
            <td>{{ i + 1 }}</td>
            <td class="cursor-pointer">
              <strong>ID:{{ item?.id }}</strong>
              -
              {{ item?.name_default }}
            </td>
            <td>
              <span class>{{ item?.errorMessage }}</span>
            </td>
          </tr>
        </ng-container>
      </tbody>
    </table>
    <span
      class="fw-300 m-3"
      style="float: right; cursor: pointer"
      *ngIf="this.errorItems.length > this.errorItemsVisibleCount"
      (click)="this.showMoreError()"
    >
      <i>
        <u>
          <strong>Xem thêm</strong>
        </u>
      </i>
    </span>
  </div>
}
