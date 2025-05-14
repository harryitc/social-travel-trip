---
to:  <%= angularOutputPath.replace('/app/features','/mock-server') %>/<%= h.changeCase.kebabCase(moduleName)%>/config.ts
---
import { API_ENDPOINTS } from "@config/api.config";
import { MockApiConfig, getApiNotUseMockHelper } from "../global-mock-server";
import { Server } from "miragejs";

// Cho phép nhữ ng route này gọi api thật
const APIs: MockApiConfig[] = [
  { path: 'query', mock: false, },
  { path: 'find-one', mock: false, },
  { path: 'delete', mock: false, },
  { path: 'update-one', mock: false, },
  { path: 'create', mock: false, },
  { path: 'delete-many-by-ids', mock: false, },
];
export const API_MOCK = getApiNotUseMockHelper(APIs, API_ENDPOINTS.<%= h.changeCase.camelCase(moduleName)%>);
export const <%= h.changeCase.pascalCase(moduleName)%>MockServer = (server: Server) => {
  server.passthrough(...API_MOCK);
}

