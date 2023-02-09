import { Form, Input, Select, Tree } from "antd";
import { DataNode } from "antd/es/tree";

import { useApiDataSource } from "@/hooks";
import { ApiObjectType, IApiProperty, IPathMethod } from "@/models";

import { ApiPropertyItem } from "./item";

export const ApiResponse = ({ api }: { api: IPathMethod }) => {
  const responses = api.responses[200];
  const { originalRef, $ref } = responses.schema ?? {};
  const _ref = originalRef
    ? originalRef
    : $ref
    ? $ref.split("/")[$ref.split("/").length - 1]
    : "";
  const { dataSource } = useApiDataSource();
  const data: IApiProperty[] = dataSource(_ref);
  return <ApiPropertyItem data={data} showHeader={true} />;
};

export const ApiTreeProperties = ({
  data,
  path,
}: {
  data: IApiProperty[];
  path: string | number;
}) => {
  const { dataSource, getRef } = useApiDataSource();
  const dataForms = ["param", "type", "mock", "extra"];
  const typeOptions = Object.keys(ApiObjectType).map(k => ({
    label: k,
    value: k,
  }));
  const getChildrenData = (data: IApiProperty[], index: number): DataNode[] => {
    return data.map((d, i) => {
      const _ref = getRef(d);
      const getChild = (_d: IApiProperty, index: number) => ({
        title: (
          <Form key={`${path}_${i}`} layout="inline">
            {Object.keys(_d).map(k => {
              if (dataForms.includes(k)) {
                const _k = k as keyof typeof d;
                const item = d[_k] as IApiProperty;
                return (
                  <Form.Item key={k} name={k} initialValue={item}>
                    {k === "type" ? (
                      <Select
                        options={typeOptions}
                        style={{ minWidth: 80 }}
                      ></Select>
                    ) : (
                      <Input placeholder={k} />
                    )}
                  </Form.Item>
                );
              }
            })}
          </Form>
        ),
        key: `${index}-${i}`,
      });
      const child = getChild(d, index);
      if (_ref === "") {
        return child;
      } else {
        const childData: IApiProperty[] = dataSource(_ref);
        return {
          ...child,
          children: getChildrenData(childData, index + 1),
        };
      }
    });
  };
  const treeData: DataNode[] = [
    {
      title: "Root",
      key: "0",
      children: getChildrenData(data, 0),
    },
  ];
  return (
    <Tree
      checkable
      defaultExpandAll
      blockNode
      defaultSelectedKeys={["0-1"]}
      treeData={treeData}
    />
  );
};

export const ApiMockResponse = ({
  api,
  path,
}: {
  api: IPathMethod;
  path: string | number;
}) => {
  const responses = api?.responses[200];
  const { originalRef, $ref } = responses?.schema ?? {};
  const _ref = originalRef
    ? originalRef
    : $ref
    ? $ref.split("/")[$ref.split("/").length - 1]
    : "";
  const { dataSource } = useApiDataSource();
  const data: IApiProperty[] = dataSource(_ref);
  return <ApiTreeProperties data={data} path={path} />;
};
