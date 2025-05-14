---
to:  <%= angularOutputPath %>/<%= h.changeCase.kebabCase(moduleName)%>/components/tools/delete-many/display-selected-items/display-selected-items.component.html
---
<h3 class="font-weight-bold">Danh sách dữ liệu đã chọn</h3>
@if(this.selectedItems.length !== 0){
<table class="table m-0 table-striped">
  <thead>
    <tr>
      <th>#</th>
      <th>Sản phẩm</th>
    </tr>
  </thead>
  <tbody>
    @for (item of this.selectedItems; track $index;) {
    @if($index < this.currentVisibleCount){
      <tr>
      <td>{{ $index + 1}}</td>
      <td class="cursor-pointer">
        <strong>ID:{{item.id}}</strong> - {{ item.name_default }}
      </td>
      </tr>
      }
      }
  </tbody>
</table>
@if(this.selectedItems.length <= this.currentVisibleCount) {
   <span class="d-flex justify-content-center">
  Bạn đã xem hết danh sách
  </span>
  }

  <span class="fw-300 m-3" style="float: right; cursor: pointer;"
        (click)="this.showMoreSelected()">
    <i>
      <u>
        <strong>
          Xem thêm
        </strong>
      </u>
    </i>
  </span>
  <span class="fw-300 m-3" style="float: right; cursor: pointer;"
        (click)="this.hideMoreSelected()">
    <i>
      <u>
        <strong>
          Ẩn bớt
        </strong>
      </u>
    </i>
  </span>
  }
  @else {
  <app-zaa-not-found-data [show]="true"></app-zaa-not-found-data>
  }
