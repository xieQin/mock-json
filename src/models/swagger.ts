export interface ISwagger {
  basePath: string;
  definitions: IDefinitions;
  host: string;
  info: ISwaggerInfo;
  paths: IPaths;
  swagger: string;
  tags: ITag[];
}

export interface ITag {
  name: string;
  description: string;
}

export interface IDefinitions {
  [key: string]: {
    properties: IDefinitionProperty;
    required: (keyof IDefinitionProperty)[];
    title: string;
    type: "object";
  };
}

export interface IDefinitionProperty {
  [key: string]: IDefinitionPropertyContent;
}

export interface IDefinitionPropertyContent {
  type: string;
  format?: string;
  description?: string;
  example?: string;
  enum: [];
  items?: ISchema;
  $ref?: string;
  originalRef?: string;
}

export interface ISwaggerInfo {
  description: string;
  title: string;
  version: string;
}

export interface IPaths {
  [key: string]: IPath;
}

export enum RequestMethod {
  Post = "post",
  Get = "get",
  Patch = "patch",
  Delete = "delete",
}

export const RequestMethodColor = {
  [RequestMethod.Post]: "green",
  [RequestMethod.Get]: "blue",
  [RequestMethod.Delete]: "red",
  [RequestMethod.Patch]: "purple",
};

export type IPath = {
  [key in RequestMethod]: IPathMethod;
};

export interface IPathMethod {
  consumes: [];
  produces: [];
  deprecated: boolean;
  operationId: string;
  parameters: IParameter[];
  responses: IResponses;
  summary: string;
  tags: string[];
}

export interface IParameter {
  description: string;
  in: string;
  type: unknown;
  name: string;
  required: boolean;
  schema: ISchema;
  example?: string;
}

export enum ResponseCode {
  HTTP_200 = "200",
  HTTP_201 = "201",
  HTTP_401 = "401",
  HTTP_403 = "403",
  HTTP_404 = "404",
}

export type IResponses = {
  [key in ResponseCode]: {
    description: string;
    schema: ISchema;
  };
};

export interface ISchema {
  $ref: string;
  originalRef: string;
}

export enum ApiType {
  String = "string",
  Number = "number",
  Array = "array",
  Object = "object",
  Boolean = "boolean",
  Integer = "integer",
}

export interface IApiProperty {
  param: string;
  type?: unknown;
  value?: unknown;
  required?: boolean;
  example?: string;
  default?: string;
  extra?: string;
  items?: ISchema;
  $ref?: string;
  originalRef?: string;
  mock?: string;
}
