import { List, Tag } from "antd";

import { IPathMethod, RequestMethod, RequestMethodColor } from "@/models";
import { ApiSelector, useStore } from "@/stores";

import styles from "./index.module.css";

export const ApiItem = ({
  api,
  method,
}: {
  api: IPathMethod;
  method: RequestMethod;
}) => {
  const { setStates } = useStore();
  return (
    <div
      aria-hidden
      className={styles.ApiItem}
      onClick={() => {
        setStates("current", api.operationId);
      }}
    >
      <List.Item>
        {api.summary}
        <Tag style={{ marginLeft: 5 }} color={RequestMethodColor[method]}>
          {method}
        </Tag>{" "}
      </List.Item>
    </div>
  );
};

export const ApiDetail = () => {
  const api = useStore(ApiSelector);
  return <div className={styles.ApiDetail}>{JSON.stringify(api)}</div>;
};
