import { List } from "antd";

import { IPath } from "@/models";

import { ApiItem } from "../items";

export const PathItem = ({ path }: { path: IPath }) => {
  const item = (k: keyof typeof path) => path[k];
  const list = Object.keys(path).map(k => ({
    method: k as keyof typeof path,
    item: item(k as keyof typeof path),
  }));
  return (
    <List
      dataSource={list}
      renderItem={api => <ApiItem api={api.item} method={api.method} />}
    />
  );
};

export const PathList = ({ paths }: { paths: IPath[] }) => {
  return (
    <>
      {paths.map((item, i) => (
        <PathItem key={i} path={item} />
      ))}
    </>
  );
};
