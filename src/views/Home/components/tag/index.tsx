import { Collapse } from "antd";

import { IPath } from "@/models";
import { TagListSelector, useStore } from "@/stores";

import { PathList } from "../path";
import styles from "./index.module.css";

const { Panel } = Collapse;

export const TagItem = ({ paths }: { paths: IPath[] }) => {
  return <PathList paths={paths} />;
};

export const TagList = () => {
  const tagList = useStore(TagListSelector);
  return (
    <div className={styles.TagList}>
      <Collapse bordered>
        {Object.keys(tagList).map((tag, i) => (
          <Panel key={i} header={tag}>
            <TagItem paths={tagList[tag]} />
          </Panel>
        ))}
      </Collapse>
    </div>
  );
};
