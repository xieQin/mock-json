import { IPath, ISwagger } from "@/models";

import apiDocs from "../../data/api-docs.json";

export interface StoreState {
  count: number;
  json: ISwagger;
  tagList: {
    [key: string]: IPath[];
  };
  current: string;
}

export const initialState: StoreState = {
  count: 0,
  json: apiDocs as unknown as ISwagger,
  tagList: {},
  current: "",
};
