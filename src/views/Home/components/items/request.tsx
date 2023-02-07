import { Radio, RadioChangeEvent, Table } from "antd";
import { useState } from "react";

import { useApiDataSource } from "@/hooks";
import { IApiProperty, IParameter, IPathMethod, RequestMethod } from "@/models";

import { ApiPropertyItem } from "./item";
import { ApiTreeProperties } from "./response";

export const ApiRequest = ({ api }: { api: IPathMethod }) => {
  const data: IApiProperty[] = [
    {
      param: "Content-Type",
      value: api.consumes,
      required: true,
      example: "",
      extra: "",
    },
  ];
  return (
    <>
      <ApiRequestHeader
        key="header"
        title={() => <h5>Headers:</h5>}
        data={data}
      />
      {api.parameters && <ApiRequestBody key="body" params={api.parameters} />}
    </>
  );
};

export const ApiRequestHeader = ({
  data,
  title,
}: {
  data: IApiProperty[];
  title?: () => JSX.Element;
}) => {
  const columns = [
    {
      title: "Name",
      dataIndex: "param",
      key: "param",
    },
    {
      title: "Value",
      dataIndex: "value",
      key: "value",
    },
    {
      title: "Required",
      dataIndex: "required",
      key: "required",
      render: (r: boolean) => (r ? "Yes" : "No"),
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
      key={`headers_${Math.random()}`}
      title={title}
      rowKey={`headers_${Math.random()}`}
      size="small"
      columns={columns}
      dataSource={data}
      pagination={false}
    />
  );
};

export const ApiRequestBody = ({ params }: { params: IParameter[] }) => {
  const { paramsSource } = useApiDataSource();
  return (
    <ApiPropertyItem
      title={() => <h5>Body:</h5>}
      showHeader={true}
      data={paramsSource(params)}
    />
  );
};

export const ApiMockRequest = ({
  item,
  method,
  path,
}: {
  item: IPathMethod;
  method: RequestMethod;
  path: string | number;
}) => {
  const options = [
    { label: "Body", value: "Body" },
    { label: "Query", value: "Query" },
    { label: "Headers", value: "Headers" },
  ];
  const methodOption = {
    [RequestMethod.Get]: "Query",
    [RequestMethod.Post]: "Body",
    [RequestMethod.Delete]: "Body",
    [RequestMethod.Patch]: "Body",
  };
  const [request, setRequest] = useState("Body");
  const onRequestChange = ({ target: { value } }: RadioChangeEvent) => {
    setRequest(value);
  };
  const { paramsSource } = useApiDataSource();
  const parameters = item?.parameters ?? [];
  const data = paramsSource(parameters);
  return (
    <div>
      <Radio.Group
        options={options}
        value={request}
        optionType="button"
        buttonStyle="solid"
        onChange={onRequestChange}
      />
      {methodOption[method] === request && (
        <div>
          <ApiTreeProperties data={data} path={path} />
        </div>
      )}
    </div>
  );
};
