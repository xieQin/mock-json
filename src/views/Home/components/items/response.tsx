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

export const TreeChildNodeTitle = (
  data: IApiProperty,
  index: number,
  path: string | number,
  typeOptions: { label: string; value: string }[],
  dataForms: string[]
) => {
  return (
    <Form key={`${path}_${index}`} layout="inline">
      {Object.keys(data).map(k => {
        if (dataForms.includes(k)) {
          const item = data[k as keyof typeof data] as IApiProperty;
          return (
            <Form.Item key={k} name={k} initialValue={item}>
              {k === "type" ? (
                <Select options={typeOptions} style={{ minWidth: 80 }}></Select>
              ) : (
                <Input placeholder={k} />
              )}
            </Form.Item>
          );
        }
      })}
    </Form>
  );
};

export const TreeChildNode = (
  data: IApiProperty,
  index: number,
  nextIndex: number,
  path: string | number,
  typeOptions: { label: string; value: string }[],
  dataForms: string[]
) => ({
  title: TreeChildNodeTitle(data, index, path, typeOptions, dataForms),
  key: `${index}-${nextIndex}`,
});

export const TreeChildrenData = (
  data: IApiProperty[],
  index: number,
  path: string | number,
  options: {
    dataSource: (ref: string) => IApiProperty[];
    getRef: (record: IApiProperty) => string;
    typeOptions: { label: string; value: string }[];
    dataForms: string[];
  }
): DataNode[] => {
  const { dataSource, getRef, dataForms, typeOptions } = options;

  return data.map((d, i) => {
    const _ref = getRef(d);
    const child = TreeChildNode(d, index, i, path, typeOptions, dataForms);
    if (_ref === "") {
      return child;
    } else {
      const childData: IApiProperty[] = dataSource(_ref);
      return {
        ...child,
        children: TreeChildrenData(childData, index + 1, path, options),
      };
    }
  });
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
    label: ApiObjectType[k as keyof typeof ApiObjectType],
    value: ApiObjectType[k as keyof typeof ApiObjectType],
  }));
  const treeData: DataNode[] = [
    {
      title: "Root",
      key: "0",
      children: TreeChildrenData(data, 0, path, {
        dataSource,
        getRef,
        typeOptions,
        dataForms,
      }),
    },
  ];
  return (
    <Tree
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
