import { Radio, RadioChangeEvent, Table } from "antd";
import { useState } from "react";

import { useApiDataSource } from "@/hooks";
import { IApiProperty, IParameter, IPathMethod } from "@/models";

import { ApiPropertyItem } from "./item";

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

export const ApiMockRequest = ({ api }: { api: IPathMethod }) => {
  const options = [
    { label: "Body", value: "Body" },
    { label: "Query", value: "Query" },
    { label: "Headers", value: "Headers" },
  ];
  const [request, setRequest] = useState("Body");
  const onRequestChange = ({ target: { value } }: RadioChangeEvent) => {
    setRequest(value);
  };
  return (
    <div>
      <Radio.Group
        options={options}
        value={request}
        optionType="button"
        buttonStyle="solid"
        onChange={onRequestChange}
      />
    </div>
  );
};
