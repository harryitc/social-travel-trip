---
to:  <%= angularOutputPath %>/<%= h.changeCase.kebabCase(moduleName)%>/README.md
---
# Finaly step to complete your feature:
## Import Nestjs feature modules:
```typescript
// Import generated module to app module feature in nestjs
const FEATURES_MODULES = [
  ...
  <%= h.changeCase.pascalCase(moduleName)%>Module, // <-- Copy this line and paste to `src/app.module.ts`
  ...
];

@Module({
  imports: [GlobalConfigurationModule, ...FEATURES_MODULES],
  providers: [...],
})
export class AppModule implements NestModule { ... }
```

## Import angular feature modules:
```typescript
// Don'f forget import your new feature modules. at memlayout route:
const memLayoutRoutes: Routes = [
  {
    path: '',
    ...
    component: MemLayoutComponent,
    children: [
      ...
      // #region Copy this object for your new feature then paste to `src/app/layouts/mem-layout/mem-layout.routing.module.ts`
      {
        path: 'add-your-path',
        loadChildren: () =>
          import('../../services/<%= h.changeCase.kebabCase(moduleName)%>.module')
          .then((m) => m.<%= h.changeCase.pascalCase(moduleName)%>Module),
      },
      // #endregion
      ...
    ],
  },
];

```
## Declare your API endpoint:
```typescript
// Add this line to your api endpoint: `src/config/api.config.ts`
export const API_ENDPOINTS = {
  ...
  <%= h.changeCase.camelCase(moduleName)%>: `${environment.domain.main}/<%= h.changeCase.kebabCase(moduleName)%>`,
  ...
}
```

## Delcare your filter session storage keys:
```typescript
// File: `src/app/config/app-storage/session-storage.config.ts`
export const SessionStorageConfigKeys = {
  global: {},
  features: {
    // Paste this value to config
    <%= h.changeCase.camelCase(moduleName)%> : {
      filters: "features.<%= h.changeCase.camelCase(moduleName)%>.filters" // <-- Copy this line and paste to file `src/app/config/app-storage/session-storage.config.ts`
    },
  },
```

## Declare mock server config:
```typescript
// File: `src/mock-server/global-mock-server.ts`
export const InitMiragejsMockServer = () =>
  createServer({
    ...
    routes() {
      ...
      <%= h.changeCase.pascalCase(moduleName)%>MockServer(this); // <-- Copy this line and paste to file `src/mock-server/global-mock-server.ts`
    },
  });
```

## Cut this json and paste to i18n language folder. Don't forget vi.json and es.json
```json
// vi.json
"<%= h.changeCase.camelCase(moduleName)%>": {
  "list": {
      "breadcrumb": {
          "breadcrumbItem1":"Enter your breadcumb",
          "breadcrumbItem2":"Enter your breadcumb",
          "breadcrumbItem3":"Enter your breadcumb"
      },
      "title": {
          "featureName": "Enter your feature name",
          "featureDesc": "Enter your feature desc"
      },
      "table": {
          <% for(let i=0; i < entityAttributes.length; i=i+2) { %>
          "<%= h.changeCase.camelCase(entityAttributes[i])%>tHead": "<%= h.changeCase.pascalCase(entityAttributes[i])%>",
          <% } %> 
          "createButton": "Thêm mới",
          "action": "Hành động",
          "tooltip": {
              "delete": "Xóa",
              "update": "Cập nhật",
            }
      },
      "delete": {
          "confirmTitle": "<i class=\"fal fa-times-circle text-danger mr-2\">Xác nhận xóa dữ liệu</i>",
          "description": "<span><strong>Dữ liệu sau khi được xóa sẽ không được phục hồi! Bạn chắt chắn muốn xóa?</strong></span>",
          "deleteSuccessMessage": "Xóa dữ liệu thành công",
          "deleteFailureMessage": "Xóa dữ liệu thất bại - vui lòng thử lại!"
      }
  },
  "filter": {
      "title": "Bộ lọc",
      "buttons": {
          "exit": "Thoát",
          "deselect": "Bỏ chọn tất cả",
          "showResult": "Xem kết quả"
      },
      "searchPlaceholder": "Tìm kiếm theo …",
      "sort": {
        <% for(let i=0; i < entityAttributes.length; i=i+2) { %>
          "<%= h.changeCase.camelCase(entityAttributes[i])%>Desc": "<%= h.changeCase.camelCase(entityAttributes[i])%> Tăng dần",
          "<%= h.changeCase.camelCase(entityAttributes[i])%>Asc": "<%= h.changeCase.camelCase(entityAttributes[i])%> Giảm dần",
        <% } %> 
        "<%= idField[0]%>Desc":"<%= idField[0]%> Tăng dần",
        "<%= idField[0]%>Asc": "<%= idField[0]%> Giảm dần"
      },
      "itemSticky": {
        "status": "Trạng thái"
      }
  },
  "create": {
      "title": "Thêm mới",
      "button": {
          "goBack": "Thoát",
          "save": "Lưu lại"
      },
      "labels": {
          <% for(let i=0; i < entityAttributes.length; i=i+2) { %>
          "<%= h.changeCase.camelCase(entityAttributes[i])%>Label": "<%= h.changeCase.camelCase(entityAttributes[i])%>" <% if (i < entityAttributes.length - 2) { %>,<% } %>
          <% } %> 
      },
      "placeholder": {
        <% for(let i=0; i < entityAttributes.length; i=i+2) { %>
          "<%= h.changeCase.camelCase(entityAttributes[i])%>Placeholder": "Nhập <%= h.changeCase.camelCase(entityAttributes[i])%>" <% if (i < entityAttributes.length - 2) { %>,<% } %>
        <% } %>
      },
      "errorMessage": {
          <% for(let i=0; i < entityAttributes.length; i=i+2) { %>
          "<%= h.changeCase.camelCase(entityAttributes[i])%>RequireErrorMessage":  "<%= h.changeCase.pascalCase(entityAttributes[i])%> không được để trống",
          <% } %> 
          "errorFromServerMessage": ""
      }
  },
  "update": {
      "title": "Cập nhật",
      "button": {
          "goBack": "Thoát",
          "save": "Lưu lại"
      },
     "labels": {
          <% for(let i=0; i < entityAttributes.length; i=i+2) { %>
          "<%= h.changeCase.camelCase(entityAttributes[i])%>Label": "<%= h.changeCase.camelCase(entityAttributes[i])%>" <% if (i < entityAttributes.length - 2) { %>,<% } %>
          <% } %> 
      },
      "placeholder": {
        <% for(let i=0; i < entityAttributes.length; i=i+2) { %>
          "<%= h.changeCase.camelCase(entityAttributes[i])%>Placeholder": "Nhập <%= h.changeCase.camelCase(entityAttributes[i])%>" <% if (i < entityAttributes.length - 2) { %>,<% } %>
        <% } %>
      },
        "errorMessage": {
          <% for(let i=0; i < entityAttributes.length; i=i+2) { %>
          "<%= h.changeCase.camelCase(entityAttributes[i])%>RequireErrorMessage":  "<%= h.changeCase.pascalCase(entityAttributes[i])%> không được để trống",
          <% } %> 
          "errorFromServerMessage": ""
      }
  },
  "detail": {
    "modalFullScreen": {
        "activeTabs": {
          "genralInfo": "Thông tin cơ bản",
          "otherInfo": "Thông tin khác"
        }
    },
    "quickView": {
        "title": "Xem nhanh",
        "closeButton": "Thoát"
    }
  },
  "otherTools": {
    "actionButton": "Tác vụ khác",
    "waringMessage": "Vui lòng chọn dữ liệu trước khi thao tác",
    "selects": {
      "deleteManyByIds": "Xóa theo chọn"
    },
    "deleteManyByIds": {
      "title":  "Xóa theo chọn",
      "backButton": "Thoát",
      "okButton":  "Xử lý",
      "processbarDisplayLabel":"Đang xử lý",
      "processbarProcessLabel":"Tiến trình xử lý" 
    }
  }
}
  
// es.json

"<%= h.changeCase.camelCase(moduleName)%>": {
  "list": {
      "breadcrumb": {
          "breadcrumbItem1":"Enter your breadcrumb",
          "breadcrumbItem2":"Enter your breadcrumb",
          "breadcrumbItem3":"Enter your breadcrumb"
      },
      "title": {
          "featureName": "Enter your feature name",
          "featureDesc": "Enter your feature description"
      },
      "table": {
          <% for(let i=0; i < entityAttributes.length; i=i+2) { %>
          "<%= h.changeCase.camelCase(entityAttributes[i])%>tHead": "<%= h.changeCase.pascalCase(entityAttributes[i])%>",
          <% } %> 
          "createButton": "Add New",
          "action": "Action",
          "tooltip": {
              "delete":"Delete",
              "update": "Update",
            }
      },
      "delete": {
          "confirmTitle": "<i class=\"fal fa-times-circle text-danger mr-2\">Confirm Data Deletion</i>",
          "description": "<span><strong>The data will not be recoverable after deletion! Are you sure you want to delete?</strong></span>",
          "deleteSuccessMessage": "Delete success!",
          "deleteFailureMessage": "Delete failure! Please try again!"
      }
      
  },
  "filter": {
      "title": "Filter",
      "buttons": {
          "exit": "Exit",
          "deselect": "Deselect All",
          "showResult": "Show Results"
      },
      "searchPlaceholder": "Search by ...",
      "sort": {
        <% for(let i=0; i < entityAttributes.length; i=i+2) { %>
          "<%= h.changeCase.camelCase(entityAttributes[i])%>Desc": "<%= h.changeCase.camelCase(entityAttributes[i])%> Ascending",
          "<%= h.changeCase.camelCase(entityAttributes[i])%>Asc": "<%= h.changeCase.camelCase(entityAttributes[i])%> Descending",
        <% } %> 
        "<%= idField[0]%>Desc":"<%= idField[0]%> Ascending",
        "<%= idField[0]%>Asc": "<%= idField[0]%> Descending"
      },
      "itemSticky": {
        "status": "Status"
      }
  },
  "create": {
      "title": "Add New",
      "button": {
          "goBack": "Exit",
          "save": "Save"
      },
      "labels": {
          <% for(let i=0; i < entityAttributes.length; i=i+2) { %>
          "<%= h.changeCase.camelCase(entityAttributes[i])%>Label": "<%= h.changeCase.camelCase(entityAttributes[i])%>" <% if (i < entityAttributes.length - 2) { %>,<% } %>
          <% } %> 
      },
      "placeholder": {
        <% for(let i=0; i < entityAttributes.length; i=i+2) { %>
          "<%= h.changeCase.camelCase(entityAttributes[i])%>Placeholder": "Enter <%= h.changeCase.camelCase(entityAttributes[i])%>" <% if (i < entityAttributes.length - 2) { %>,<% } %>
        <% } %>
      },
      "errorMessage": {
          <% for(let i=0; i < entityAttributes.length; i=i+2) { %>
          "<%= h.changeCase.camelCase(entityAttributes[i])%>RequireErrorMessage":  "<%= h.changeCase.pascalCase(entityAttributes[i])%> required",
          <% } %> 
          "errorFromServerMessage": ""
      }
  },
  "update": {
      "title": "Update",
      "button": {
          "goBack": "Exit",
          "save": "Save"
      },
        "labels": {
          <% for(let i=0; i < entityAttributes.length; i=i+2) { %>
          "<%= h.changeCase.camelCase(entityAttributes[i])%>Label": "<%= h.changeCase.camelCase(entityAttributes[i])%>" <% if (i < entityAttributes.length - 2) { %>,<% } %>
          <% } %> 
      },
      "placeholder": {
        <% for(let i=0; i < entityAttributes.length; i=i+2) { %>
          "<%= h.changeCase.camelCase(entityAttributes[i])%>Placeholder": "Enter <%= h.changeCase.camelCase(entityAttributes[i])%>" <% if (i < entityAttributes.length - 2) { %>,<% } %>
        <% } %>
      },
        "errorMessage": {
          <% for(let i=0; i < entityAttributes.length; i=i+2) { %>
          "<%= h.changeCase.camelCase(entityAttributes[i])%>RequireErrorMessage":  "<%= h.changeCase.pascalCase(entityAttributes[i])%> required",
          <% } %> 
          "errorFromServerMessage": ""
      }
  },
  "detail": {
    "modalFullScreen": {
        "activeTabs": {
          "genralInfo": "General Information",
          "otherInfo": "Other Information"
        }
    },
    "quickView": {
        "title": "Quick View",
        "closeButton": "Exit"
    }
  },
  "otherTools": {
    "actionButton": "Other Actions",
    "waringMessage": "Please select data before proceeding",
    "selects": {
        "deleteManyByIds": "Delete selected"
    },
    "deleteManyByIds": {
        "title": "Delete selected",
        "backButton": "Back",
        "okButton": "Process",
        "processbarDisplayLabel": "Processing",
          "processbarProcessLabel": "Processing"
      }
  }
}

```