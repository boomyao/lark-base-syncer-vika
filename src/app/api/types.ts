export interface BaseRequestBody {
  params: string;
  context: string;
}

export interface TableMetaRequestParams {
  datasourceConfig: string;
}

export type DataSourceConfig = Record<string, string>;

export interface RequestContext {
  bitable: {
    token: string;
    logID: string;
  }
  packID: string;
  type: string;
  tenantKey: string;
  userTenantKey: string;
  bizInstanceID: string;
  scriptArgs: {
    projectURL: string;
    baseOpenID: string;
  }
}

export interface RecordsRequestParams {
  datasourceConfig: string;
  transactionID: string;
  pageToken: string;
  maxPageSize: number;
}