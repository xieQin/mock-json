import { Descriptions, Tag } from "antd";

import { IPathMethod, RequestMethod } from "@/models";
import { ApiSelector, useStore } from "@/stores";

import { ApiMethod } from ".";
import { ApiRequest } from "./request";
import { ApiResponse } from "./response";

export const ApiBasic = ({
  item,
  method,
  path,
}: {
  item: IPathMethod;
  method: RequestMethod;
  path: string | number;
}) => {
  const { Item } = Descriptions;
  return (
    <Descriptions bordered>
      <Item key="title" label="Title">
        {item.summary}
      </Item>
      <Item key="path" label="Path">
        <ApiMethod method={method} /> {path}
      </Item>
      <Item key="tags" label="Tags">
        {item?.tags && item?.tags.map((tag, i) => <Tag key={i}>{tag}</Tag>)}
      </Item>
    </Descriptions>
  );
};

export const ApiDetailInfo = () => {
  const api = useStore(ApiSelector);
  if (!api) return <></>;
  return (
    <>
      <div>
        <h4>Basic Info</h4>
        <ApiBasic {...api} />
      </div>
      <div style={{ marginTop: 16 }}>
        <h4>Request</h4>
        <ApiRequest api={api.item} />
      </div>
      <div style={{ marginTop: 16 }}>
        <h4>Response</h4>
        <ApiResponse api={api.item} />
      </div>
    </>
  );
};
