---
to:  <%= angularOutputPath %>/<%= h.changeCase.kebabCase(moduleName)%>/<%= h.changeCase.kebabCase(moduleName)%>.config.ts
---
import { API_ENDPOINTS } from "@config/api.config";
import { SortOptions } from "@shared/components/zaa-sort/zaa-sort.component";
import { SessionStorageConfigKeys } from '@config/app-storage/session-storage.config';

const languagePathBuilder = (path: string[]) => {
    return `features.<%= h.changeCase.camelCase(moduleName)%>.${path.join('.')}`;
}

/**
 * Add this line to API_ENDPOINTS config:
 * export const API_ENDPOINTS = {
 *    ...
 *    <%= h.changeCase.camelCase(moduleName)%>: `${environment.domain.main}/<%= h.changeCase.kebabCase(moduleName)%>`,
 *    ...
 * }
 */
export const FEAUTRE_MODULES_APIS = {
    <% if (featureToGenerate.includes('Create_One')) { %>
    CREATE: `${API_ENDPOINTS.<%= h.changeCase.camelCase(moduleName)%>}/create`,
    <% } %>  
    QUERY: `${API_ENDPOINTS.<%= h.changeCase.camelCase(moduleName)%>}/query`,
    <% if (featureToGenerate.includes('Fullscreen_Detail') || featureToGenerate.includes('Quick_View')) { %>
    GET_ONE_BY_ID: `${API_ENDPOINTS.<%= h.changeCase.camelCase(moduleName)%>}/find-one`,
    <% } %>
    <% if (featureToGenerate.includes('Update_One')) { %>
    UDPATE: `${API_ENDPOINTS.<%= h.changeCase.camelCase(moduleName)%>}/update-one`,
    <% } %>  
    <% if (featureToGenerate.includes('Delete_By_Id')) { %>
    DELETE_BY_ID: `${API_ENDPOINTS.<%= h.changeCase.camelCase(moduleName)%>}/delete`,
    <% } %>  
    <% if (featureToGenerate.includes('Multi_Action_Delete')) { %>   
    DELETE_MANY_BY_IDs:`${API_ENDPOINTS.<%= h.changeCase.camelCase(moduleName)%>}/delete-many-by-ids`,
    <% } %>  
    // Add other api if nescessarry
}

/** 
  Config localstorage key to save filter attribute in localstorage
  File: src/config/app-storage/session-storage.config.ts
  
  export const SessionStorageConfigKeys = {
  global: {},
  features: {
    // Paste this value to config
    <%= h.changeCase.camelCase(moduleName)%> : {
      filters: "features.<%= h.changeCase.camelCase(moduleName)%>.filters"
    },
  },
};
*/
export const FILTER_SHARE_STATE_STORAGE_KEY = SessionStorageConfigKeys.features.<%= h.changeCase.camelCase(moduleName)%>.filters;

// This config is input value for sort component near paginator component
export const SORT_OPTIONS: Array<SortOptions> = [
    {
      id: '<%= idField[0]%>:desc',
      displayText: languagePathBuilder(['filter', 'sort', '<%= idField[0]%>Desc']),
      icon: 'fal fa-sort-alpha-down'
    },
    {
      id: '<%= idField[0]%>:asc',
      displayText: languagePathBuilder(['filter', 'sort', '<%= idField[0]%>Asc']),
      icon: 'fal fa-sort-alpha-up'
    },
     <% for(let i=0; i < entityAttributes.length; i=i+2) { %>
     {
        id: '<%= entityAttributes[i] %>:desc',
        displayText: languagePathBuilder(['filter', 'sort', '<%= h.changeCase.camelCase(entityAttributes[i])%>Desc']),
        icon: 'fal fa-sort-alpha-down',
     },
     {
        id: '<%= entityAttributes[i] %>:asc',
        displayText: languagePathBuilder(['filter', 'sort', '<%= h.changeCase.camelCase(entityAttributes[i])%>Asc']),
        icon: 'fal fa-sort-alpha-down',
     },
      <% } %> 
];

// Config key of language in this variable:
export const LANGUAGE = {
    // List
    list: {
        breadcrumb: {
            breadcrumbItem1: languagePathBuilder(['list', 'breadcrumb', 'breadcrumbItem1']),
            breadcrumbItem2: languagePathBuilder(['list', 'breadcrumb', 'breadcrumbItem2']),
            breadcrumbItem3: languagePathBuilder(['list', 'breadcrumb', 'breadcrumbItem3']),
        },
        title: {
            featureName: languagePathBuilder(['list', 'title', 'featureName']),
            featureDesc: languagePathBuilder(['list', 'title', 'featureDesc']),
        },
        table: {
            createButton: languagePathBuilder(['list', 'table', 'createButton']),
            action: languagePathBuilder(['list', 'table', 'action']),
            tooltip: {
              delete: languagePathBuilder(['list', 'table', 'tooltip','delete']),
              update: languagePathBuilder(['list', 'table', 'tooltip','update']),
            },
            <% for(let i=0; i < entityAttributes.length; i=i+2) { %>
            <%= h.changeCase.camelCase(entityAttributes[i])%>tHead: languagePathBuilder(['list', 'table', '<%= h.changeCase.camelCase(entityAttributes[i])%>tHead']),
            <% } %> 
        },
        delete: {
            confirmTitle: languagePathBuilder(['list', 'delete', 'confirmTitle']),
            description: languagePathBuilder(['list', 'delete', 'description']),
            deleteSuccessMessage: languagePathBuilder(['list', 'delete', 'deleteSuccessMessage']),
            deleteFailureMessage: languagePathBuilder(['list', 'delete', 'deleteFailureMessage']),
        },
    },
    // Filter
    filter: {
        title: languagePathBuilder(['filter', 'title']),
        buttons: {
            exit: languagePathBuilder(['filter', 'buttons', 'exit']),
            deselect: languagePathBuilder(['filter', 'buttons', 'deselect']),
            showResult: languagePathBuilder(['filter', 'buttons', 'showResult']),
        },
        searchPlaceholder: languagePathBuilder(['filter', 'searchPlaceholder']),
        sort: {
          <% for(let i=0; i < entityAttributes.length; i=i+2) { %>
            <%= h.changeCase.camelCase(entityAttributes[i])%>Desc: languagePathBuilder(['filter', 'sort', '<%= h.changeCase.camelCase(entityAttributes[i])%>Desc']),
            <%= h.changeCase.camelCase(entityAttributes[i])%>Asc: languagePathBuilder(['filter', 'sort', '<%= h.changeCase.camelCase(entityAttributes[i])%>Asc']),
          <% } %> 
          <%= idField[0]%>Desc: languagePathBuilder(['filter', 'sort', '<%= idField[0]%>Desc']),
          <%= idField[0]%>Asc: languagePathBuilder(['filter', 'sort', '<%= idField[0]%>Asc']),
        },
        itemSticky: {
          status: languagePathBuilder(['filter', 'itemSticky', 'status']),
        }
    },
    
    // Create
    create: {
        title: languagePathBuilder(['create', 'title']),
        button: {
            goBack: languagePathBuilder(['create', 'button', 'goBack']),
            save: languagePathBuilder(['create', 'button', 'save']),
        },
        labels: {
           <% for(let i=0; i < entityAttributes.length; i=i+2) { %>
            <%= h.changeCase.camelCase(entityAttributes[i])%>Label: languagePathBuilder(['create', 'labels', '<%= h.changeCase.camelCase(entityAttributes[i])%>Label'])<% if (i < entityAttributes.length - 2) { %>,<% } %>
            <% } %> 
        },
        placeholder: {
          <% for(let i=0; i < entityAttributes.length; i=i+2) { %>
            <%= h.changeCase.camelCase(entityAttributes[i])%>Placeholder: languagePathBuilder(['create', 'placeholder', '<%= h.changeCase.camelCase(entityAttributes[i])%>Placeholder'])<% if (i < entityAttributes.length - 2) { %>,<% } %>
          <% } %>
        },
        errorMessage: {
           <% for(let i=0; i < entityAttributes.length; i=i+2) { %>
            <%= h.changeCase.camelCase(entityAttributes[i])%>RequireErrorMessage: languagePathBuilder(['create', 'errorMessage', '<%= h.changeCase.camelCase(entityAttributes[i])%>RequireErrorMessage']),
            <% } %> 
          errorFromServerMessage: ""
        },
    },

    // Update 
    update: {
        title: languagePathBuilder(['update', 'title']),
        button: {
            goBack: languagePathBuilder(['update', 'button', 'goBack']),
            save: languagePathBuilder(['update', 'button', 'save']),
        },
        labels: {
           <% for(let i=0; i < entityAttributes.length; i=i+2) { %>
            <%= h.changeCase.camelCase(entityAttributes[i])%>Label: languagePathBuilder(['update', 'labels', '<%= h.changeCase.camelCase(entityAttributes[i])%>Label'])<% if (i < entityAttributes.length - 2) { %>,<% } %>
            <% } %> 
        },
        placeholder: {
          <% for(let i=0; i < entityAttributes.length; i=i+2) { %>
            <%= h.changeCase.camelCase(entityAttributes[i])%>Placeholder: languagePathBuilder(['update', 'placeholder', '<%= h.changeCase.camelCase(entityAttributes[i])%>Placeholder'])<% if (i < entityAttributes.length - 2) { %>,<% } %>
          <% } %>
        },
        errorMessage: {
           <% for(let i=0; i < entityAttributes.length; i=i+2) { %>
            <%= h.changeCase.camelCase(entityAttributes[i])%>RequireErrorMessage: languagePathBuilder(['update', 'errorMessage', '<%= h.changeCase.camelCase(entityAttributes[i])%>RequireErrorMessage']),
            <% } %> 
          errorFromServerMessage: ""
        },
    },
    detail: {
      modalFullScreen: {
          activeTabs: {
            genralInfo: languagePathBuilder(['detail', 'modalFullScreen', 'activeTabs', 'genralInfo']),
            otherInfo: languagePathBuilder(['detail', 'modalFullScreen', 'activeTabs', 'otherInfo']),
          }
      },
      quickView: {
          title: languagePathBuilder(['detail', 'quickView', 'title']),
          closeButton:  languagePathBuilder(['detail', 'quickView', 'closeButton'])
      }
    },
    otherTools: {
      actionButton: languagePathBuilder(['otherTools', 'actionButton']),
      waringMessage: languagePathBuilder(['otherTools', 'waringMessage']),
      selects: {
        deleteManyByIds:  languagePathBuilder(['otherTools', 'selects', 'deleteManyByIds']),
      },
      deleteManyByIds: {
        title:  languagePathBuilder(['otherTools', 'deleteManyByIds', 'title']),
        backButton:  languagePathBuilder(['otherTools', 'deleteManyByIds', 'backButton']),
        okButton:  languagePathBuilder(['otherTools', 'deleteManyByIds', 'okButton']),
        processBarLabel:  languagePathBuilder(['otherTools', 'deleteManyByIds', 'okButton']),
        processbarDisplayLabel:  languagePathBuilder(['otherTools', 'deleteManyByIds', 'okButton']),
        processbarProcessLabel:  languagePathBuilder(['otherTools', 'deleteManyByIds', 'okButton']),
      }
    }
}


// Additional config in this region