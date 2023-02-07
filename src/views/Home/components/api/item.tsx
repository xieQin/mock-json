import { Table } from "antd";

import { useApiDataSource } from "@/hooks";
import { IApiProperty } from "@/models";

export const ApiPropertyItem = ({
  data,
  title,
  showHeader,
}: {
  data: IApiProperty[];
  title?: () => JSX.Element;
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
      title: "Required",
      dataIndex: "required",
      key: "required",
      render: (r: boolean) => (r ? "Yes" : "No"),
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
      key={`item_${Math.random()}`}
      title={title}
      rowKey={`item_${Math.random()}`}
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
