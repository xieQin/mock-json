import { IPath, IPathMethod } from "@/models";

import { Store } from "./store";

export const TagListSelector = (s: Store) => {
  const { json } = s;
  const { tags, paths } = json;
  const res: {
    [key: string]: IPath[];
  } = {};
  for (const tag of tags) {
    res[tag.name] = [];
  }
  for (const path in paths) {
    for (const method in paths[path]) {
      const _p = path as keyof typeof paths;
      const _i = paths[_p];
      const _k = method as keyof typeof _i;
      const item = paths[_p][_k] as IPathMethod;
      for (const _tag of item.tags) {
        res[_tag].push(paths[path]);
      }
    }
  }
  return res;
};
