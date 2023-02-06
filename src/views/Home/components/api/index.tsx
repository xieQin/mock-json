import { Descriptions, List, Table, Tag } from "antd";

import {
  IParameter,
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
        setStates("current", api.operationId || api.summary);
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

export const ApiRequest = ({ api }: { api: IPathMethod }) => {
  const headers: IApiRequestHeaders[] = [
    {
      param: "Content-Type",
      paramValue: api.consumes,
      required: true,
      example: "",
      extra: "",
    },
  ];
  return (
    <>
      <h4>Request</h4>
      <ApiRequestHeader key="header" headers={headers} />
      {api.parameters && <ApiRequestBody key="body" params={api.parameters} />}
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
      title: "Param Name",
      dataIndex: "param",
      key: "param",
    },
    {
      title: "Param Value",
      dataIndex: "paramValue",
      key: "paramValue",
    },
    {
      title: "IsRequired",
      dataIndex: "required",
      key: "required",
      render: (r: boolean) => (r ? "是" : "否"),
    },
    {
      title: "Example",
      dataIndex: "example",
      key: "example",
    },
    {
      title: "Extra",
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

export const ApiRequestBody = ({ params }: { params: IParameter[] }) => {
  const { paramsSource } = useApiDataSource();
  return (
    <>
      <h5>Body:</h5>
      <ApiPropertyItem showHeader={true} data={paramsSource(params)} />
    </>
  );
};

// todo refactor source functions
export const useApiDataSource = () => {
  const { json } = useStore();
  const { definitions } = json;

  const dataSource = (ref: string): IApiRequestBody[] => {
    const _definition = definitions[ref];
    const res: IApiRequestBody[] = [];
    for (const _p in _definition?.properties) {
      const k = _p as keyof typeof _definition.properties;
      const property = _definition.properties[k];
      const originalRef = property.originalRef
        ? property.originalRef
        : property.items
        ? property.items.originalRef
        : "";
      const $ref = property.$ref
        ? property.$ref
        : property.items
        ? property.items.$ref
        : "";
      res.push({
        ...property,
        param: _p,
        type: property.type,
        default: "",
        required: !_definition.required
          ? false
          : _definition.required.includes(_p),
        example: property.example ?? "",
        extra: property.description ?? "",
        originalRef,
        $ref,
      });
    }
    return res;
  };

  const paramsSource = (params: IParameter[]) => {
    const res: IApiRequestBody[] = [];
    for (const param of params) {
      if (param.schema) {
        const bodyParams = definitions[param.schema?.originalRef];
        if (!bodyParams) continue;
        for (const _p in bodyParams?.properties) {
          const k = _p as keyof typeof bodyParams.properties;
          const property = bodyParams?.properties[k];
          res.push({
            ...property,
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
      } else {
        res.push({
          ...param,
          param: param.name,
          type: param.type,
          default: "",
          required: param.required,
          example: param.example ?? "",
          extra: param.description ?? "",
        });
      }
    }
    return res;
  };

  const getRef = (record: IApiRequestBody): string => {
    const _getRef = ($ref: string) =>
      $ref.split("/")[$ref.split("/").length - 1];
    if (record.originalRef) return record.originalRef;
    if (record.$ref) return _getRef(record.$ref);
    if (record.items && record.items.originalRef)
      return record.items.originalRef;
    if (record.items && record.items.$ref) return _getRef(record.items.$ref);
    return "";
  };

  return {
    dataSource,
    paramsSource,
    getRef,
  };
};

export const ApiResponseBody = ({ api }: { api: IPathMethod }) => {
  const responses = api.responses[200];
  const { originalRef, $ref } = responses.schema;
  const _ref = originalRef
    ? originalRef
    : $ref
    ? $ref.split("/")[$ref.split("/").length - 1]
    : "";
  const { dataSource } = useApiDataSource();
  const data: IApiRequestBody[] = dataSource(_ref);
  return <ApiPropertyItem data={data} showHeader={true} />;
};

export const ApiPropertyItem = ({
  data,
  showHeader,
}: {
  data: IApiRequestBody[];
  showHeader: boolean;
}) => {
  const { dataSource, getRef } = useApiDataSource();
  const columns = [
    {
      title: "Name",
      dataIndex: "param",
      key: "param",
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
    },
    {
      title: "IsRequired",
      dataIndex: "required",
      key: "required",
      render: (r: boolean) => (r ? "是" : "否"),
    },
    {
      title: "Default",
      dataIndex: "default",
      key: "default",
    },
    {
      title: "Example",
      dataIndex: "example",
      key: "example",
    },
    {
      title: "Extra",
      dataIndex: "extra",
      key: "extra",
    },
  ];
  return (
    <Table
      rowKey="body"
      size="small"
      columns={columns}
      showHeader={showHeader}
      dataSource={data}
      expandable={{
        expandedRowRender: record =>
          getRef(record) !== "" ? (
            <ApiPropertyItem
              data={dataSource(getRef(record) as string)}
              showHeader={false}
            />
          ) : (
            <></>
          ),
        rowExpandable: record => getRef(record) !== "",
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
            {api?.item?.tags &&
              api?.item?.tags.map((tag, i) => <Tag key={i}>{tag}</Tag>)}
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
