import { Descriptions } from "antd";

import styles from "@/assets/styles/Home.module.css";
import { useStore } from "@/stores";

import { ApiTabs } from "./components/items";
import { TagList } from "./components/tag";

export const SwaggerInfo = () => {
  const { json } = useStore();
  const { Item } = Descriptions;
  return (
    <div className={styles.HomeHeader}>
      <Descriptions bordered title="Swagger Info">
        <Item label="Title">{json.info.title}</Item>
        <Item label="Version">{json.info.version}</Item>
        <Item label="Description">{json.info.description}</Item>
        <Item label="Host">{json.host}</Item>
        <Item label="BasePath">{json.basePath}</Item>
      </Descriptions>
    </div>
  );
};

export default function HomePage() {
  return (
    <div className={styles.Home}>
      <SwaggerInfo />
      <div className={styles.HomeSection}>
        <div className={styles.HomeSide}>
          <TagList />
        </div>
        <div className={styles.HomeContent}>
          <ApiTabs />
        </div>
      </div>
    </div>
  );
}
