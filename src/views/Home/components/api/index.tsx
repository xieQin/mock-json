import { Descriptions, List, Table, Tag } from "antd";

import {
  IPathMethod,
  ISchema,
  RequestMethod,
  RequestMethodColor,
} from "@/models";
import { ApiSelector, useStore } from "@/stores";

import styles from "./index.module.css";

export const ApiMethod = ({ method }: { method: RequestMethod }) => {
  return (
    <Tag style={{ marginLeft: 5 }} color={RequestMethodColor[method]}>
      {method}
    </Tag>
  );
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
        setStates("current", api.operationId);
      }}
    >
      <List.Item>
        {api.summary}
        <ApiMethod method={method} />
      </List.Item>
    </div>
  );
};

export interface IApiRequestHeaders {
  param: string;
  paramValue: unknown;
  required: boolean;
  example: string;
  extra: string;
}

export interface IApiRequestBody {
  param: string;
  type: unknown;
  required?: boolean;
  example?: string;
  default?: string;
  extra?: string;
  items?: ISchema;
  $ref?: string;
  originalRef?: string;
}

// todo refactor body
export const ApiRequest = ({ api }: { api: IPathMethod }) => {
  const { json } = useStore();
  const { definitions } = json;
  const headers: IApiRequestHeaders[] = [
    {
      param: "Content-Type",
      paramValue: api.consumes,
      required: true,
      example: "",
      extra: "",
    },
  ];
  const body: IApiRequestBody[] = [];
  if (api.parameters) {
    for (const param of api.parameters) {
      const bodyParams = definitions[param.schema?.originalRef];
      if (!bodyParams) continue;
      for (const _p in bodyParams?.properties) {
        const k = _p as keyof typeof bodyParams.properties;
        const property = bodyParams?.properties[k];
        body.push({
          param: _p,
          type: property.type,
          default: "",
          required: !bodyParams.required
            ? false
            : bodyParams.required.includes(_p),
          example: property.example ?? "",
          extra: property.description ?? "",
        });
      }
    }
  }
  return (
    <>
      <h4>Request</h4>
      <ApiRequestHeader key="header" headers={headers} />
      <ApiRequestBody key="body" body={body} />
    </>
  );
};

export const ApiRequestHeader = ({
  headers,
}: {
  headers: IApiRequestHeaders[];
}) => {
  const columns = [
    {
      title: "参数名称",
      dataIndex: "param",
      key: "param",
    },
    {
      title: "参数值",
      dataIndex: "paramValue",
      key: "paramValue",
    },
    {
      title: "是否必须",
      dataIndex: "required",
      key: "required",
      render: (r: boolean) => (r ? "是" : "否"),
    },
    {
      title: "示例",
      dataIndex: "example",
      key: "example",
    },
    {
      title: "备注",
      dataIndex: "extra",
      key: "extra",
    },
  ];
  return (
    <>
      <h5>Headers:</h5>
      <Table
        rowKey="headers"
        size="small"
        columns={columns}
        dataSource={headers}
        pagination={false}
      />
    </>
  );
};

export const ApiRequestBody = ({ body }: { body: IApiRequestBody[] }) => {
  const columns = [
    {
      title: "名称",
      dataIndex: "param",
      key: "param",
    },
    {
      title: "类型",
      dataIndex: "type",
      key: "type",
    },
    {
      title: "是否必须",
      dataIndex: "required",
      key: "required",
      render: (r: boolean) => (r ? "是" : "否"),
    },
    {
      title: "默认值",
      dataIndex: "default",
      key: "default",
    },
    {
      title: "示例",
      dataIndex: "example",
      key: "example",
    },
    {
      title: "其他信息",
      dataIndex: "extra",
      key: "extra",
    },
  ];
  return (
    <>
      <h5>Body:</h5>
      <Table
        rowKey="body"
        size="small"
        columns={columns}
        dataSource={body}
        pagination={false}
      />
    </>
  );
};

// todo refactor body
export const ApiResponseBody = ({ api }: { api: IPathMethod }) => {
  const columns = [
    {
      title: "名称",
      dataIndex: "param",
      key: "param",
    },
    {
      title: "类型",
      dataIndex: "type",
      key: "type",
    },
    {
      title: "是否必须",
      dataIndex: "required",
      key: "required",
      render: (r: boolean) => (r ? "是" : "否"),
    },
    {
      title: "默认值",
      dataIndex: "default",
      key: "default",
    },
    {
      title: "示例",
      dataIndex: "example",
      key: "example",
    },
    {
      title: "其他信息",
      dataIndex: "extra",
      key: "extra",
    },
  ];
  const { json } = useStore();
  const { definitions } = json;
  const responses = api.responses[200];
  const _R = definitions[responses.schema?.originalRef];
  const response: IApiRequestBody[] = [];
  for (const _p in _R?.properties) {
    const k = _p as keyof typeof _R.properties;
    const property = _R.properties[k];
    response.push({
      ...property,
      param: _p,
      type: property.type,
      default: "",
      required: !_R.required ? false : _R.required.includes(_p),
      example: property.example ?? "",
      extra: property.description ?? "",
      originalRef: property.items
        ? property.items.originalRef
        : property.originalRef
        ? property.originalRef
        : undefined,
    });
  }
  return (
    <Table
      rowKey="body"
      size="small"
      columns={columns}
      dataSource={response}
      expandable={{
        expandedRowRender: record =>
          record.originalRef ? (
            <ApiResponseBodyItem originalRef={record.originalRef} />
          ) : (
            <></>
          ),
        rowExpandable: record => record.originalRef !== undefined,
      }}
      pagination={false}
    />
  );
};

export const ApiResponseBodyItem = ({
  originalRef,
}: {
  originalRef: string;
}) => {
  const { json } = useStore();
  const { definitions } = json;
  const _R = definitions[originalRef];
  const response: IApiRequestBody[] = [];
  for (const _p in _R?.properties) {
    const k = _p as keyof typeof _R.properties;
    const property = _R.properties[k];
    response.push({
      ...property,
      param: _p,
      type: property.type,
      default: "",
      required: !_R.required ? false : _R.required.includes(_p),
      example: property.example ?? "",
      extra: property.description ?? "",
      originalRef: property.items
        ? property.items.originalRef
        : property.originalRef
        ? property.originalRef
        : undefined,
    });
  }
  const columns = [
    {
      dataIndex: "param",
      key: "param",
    },
    {
      dataIndex: "type",
      key: "type",
    },
    {
      dataIndex: "required",
      key: "required",
      render: (r: boolean) => (r ? "是" : "否"),
    },
    {
      dataIndex: "default",
      key: "default",
    },
    {
      dataIndex: "example",
      key: "example",
    },
    {
      dataIndex: "extra",
      key: "extra",
    },
  ];
  return (
    <Table
      rowKey="body"
      size="small"
      columns={columns}
      dataSource={response}
      expandable={{
        expandedRowRender: record =>
          record.originalRef ? (
            <ApiResponseBodyItem originalRef={record.originalRef} />
          ) : (
            <></>
          ),
        rowExpandable: record => record.originalRef !== undefined,
      }}
      pagination={false}
    />
  );
};

export const ApiDetail = () => {
  const api = useStore(ApiSelector);
  if (!api) return <></>;
  const { Item } = Descriptions;
  return (
    <div className={styles.ApiDetail}>
      <div>
        <h4>Basic Info</h4>
        <Descriptions bordered>
          <Item key="title" label="Title">
            {api?.item.summary}
          </Item>
          <Item key="path" label="Path">
            <ApiMethod method={api?.method} /> {api?.path}
          </Item>
          <Item key="tags" label="Tags">
            {api?.item.tags.map((tag, i) => (
              <Tag key={i}>{tag}</Tag>
            ))}
          </Item>
        </Descriptions>
      </div>
      <div style={{ marginTop: 16 }}>
        <ApiRequest api={api.item} />
      </div>
      <div style={{ marginTop: 16 }}>
        <h4>Response</h4>
        <ApiResponseBody api={api.item} />
      </div>
    </div>
  );
};
