import { Button, Form, Input } from "antd";

import { IPathMethod, RequestMethod } from "@/models";
import { ApiSelector, useStore } from "@/stores";

import { ApiMethod } from "./api";
import { ApiMockRequest } from "./request";
import { ApiMockResponse } from "./response";

export const ApiMockBasic = ({
  item,
  method,
  path,
}: {
  item: IPathMethod;
  method: RequestMethod;
  path: string | number;
}) => {
  const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 20 },
  };

  return (
    <Form key={path} {...layout}>
      <Form.Item name="summary" label="API Name" initialValue={item.summary}>
        <Input style={{ width: 300 }} />
      </Form.Item>
      <Form.Item
        name="path"
        label="API path"
        initialValue={path}
        extra={<ApiMethod method={method} />}
      >
        <Input style={{ width: 300 }} />
      </Form.Item>
    </Form>
  );
};

export const ApiMocks = () => {
  const api = useStore(ApiSelector);
  return api ? (
    <>
      <div>
        <h4>Basic Settings</h4>
        <ApiMockBasic {...api} />
      </div>
      <div style={{ marginTop: 16 }}>
        <h4>Request Settings</h4>
        <ApiMockRequest {...api} />
      </div>
      <div style={{ marginTop: 16 }}>
        <h4>Response Settings</h4>
        <ApiMockResponse api={api?.item} path={api?.path} />
      </div>
      <Button
        size="middle"
        onClick={() => {
          console.log("22");
        }}
      >
        Save
      </Button>
    </>
  ) : (
    <></>
  );
};
