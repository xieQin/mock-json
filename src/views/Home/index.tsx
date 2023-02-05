// import styles from "@/assets/styles/Home.module.css";
import { Collapse, List } from "antd";

import { IPath, IPathMethod } from "@/models";
import { TagListSelector, useStore } from "@/stores";

const { Panel } = Collapse;

export const ApiItem = ({ api }: { api: IPathMethod }) => {
  return <List.Item>{api.summary}</List.Item>;
};

export const PathItem = ({ path }: { path: IPath }) => {
  const item = (k: keyof typeof path) => path[k];
  const list = Object.keys(path).map(k => item(k as keyof typeof path));
  return <List dataSource={list} renderItem={api => <ApiItem api={api} />} />;
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

export const TagItem = ({ paths }: { paths: IPath[] }) => {
  return <PathList paths={paths} />;
};

export const TagList = () => {
  const tagList = useStore(TagListSelector);
  return (
    <Collapse ghost>
      {Object.keys(tagList).map((tag, i) => (
        <Panel key={i} header={tag}>
          <TagItem paths={tagList[tag]} />
        </Panel>
      ))}
    </Collapse>
  );
};

export default function HomePage() {
  return <TagList />;
}
