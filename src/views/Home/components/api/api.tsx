import { List, Tag } from "antd";

import { IPathMethod, RequestMethod, RequestMethodColor } from "@/models";
import { useStore } from "@/stores";

import styles from "./index.module.css";

export const ApiMethod = ({ method }: { method: RequestMethod }) => {
  return <Tag color={RequestMethodColor[method]}>{method}</Tag>;
};

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
        setStates("current", api.operationId || api.summary);
      }}
    >
      <List.Item>
        <ApiMethod method={method} />
        {api.summary}
      </List.Item>
    </div>
  );
};
