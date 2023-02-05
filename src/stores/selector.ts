import { IPath, IPathMethod } from "@/models";

import { Store } from "./store";

export const ApiSelector = (s: Store) => {
  const { current, json } = s;
  const { paths } = json;
  for (const path in paths) {
    for (const method in paths[path]) {
      const _p = path as keyof typeof paths;
      const _i = paths[_p];
      const _k = method as keyof typeof _i;
      const item = paths[_p][_k] as IPathMethod;
      if (item.operationId === current || item.summary === current)
        return {
          item,
          path: _p,
          method: _k,
        };
    }
  }
  return null;
};

export const TagListSelector = (s: Store) => {
  const { json } = s;
  const { tags, paths } = json;
  const res: {
    [key: string]: IPath[];
  } = {};
  if (tags) {
    for (const tag of tags) {
      res[tag.name] = [];
    }
  }
  for (const path in paths) {
    for (const method in paths[path]) {
      const _p = path as keyof typeof paths;
      const _i = paths[_p];
      const _k = method as keyof typeof _i;
      const item = paths[_p][_k] as IPathMethod;
      if (item.tags) {
        for (const _tag of item.tags) {
          if (res[_tag]) {
            res[_tag].push(paths[path]);
          } else {
            res[_tag] = [paths[path]];
          }
        }
      } else {
        if (res[path]) {
          res[path].push(paths[path]);
        } else {
          res[path] = [paths[path]];
        }
      }
    }
  }
  return res;
};
