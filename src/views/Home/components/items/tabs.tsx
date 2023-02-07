import { Tabs } from "antd";

import { ApiDetailInfo } from "./detail";
import styles from "./index.module.css";
import { ApiMocks } from "./mock";

export const ApiTabs = () => {
  const tabItems = [
    {
      key: "info",
      label: `API Info`,
      children: <ApiDetailInfo />,
    },
    {
      key: "mock",
      label: `API Mock`,
      children: <ApiMocks />,
    },
  ];
  return (
    <div className={styles.ApiDetail}>
      <Tabs defaultActiveKey="info" items={tabItems} />
    </div>
  );
};
