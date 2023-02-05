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
  [key: string]: {
    type: string;
    format?: string;
    description: string;
    example: string;
    enum: [];
  };
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

export type IPath = {
  [key in RequestMethod]: IPathMethod;
};

export interface IPathMethod {
  consumes: [];
  produces: [];
  deprecated: boolean;
  operationId: string;
  parameters: [];
  responses: IResponses;
  summary: string;
  tags: string[];
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
    schema: {
      $ref: string;
      originalRef: string;
    };
  };
};
