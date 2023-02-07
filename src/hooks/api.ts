import { IApiProperty, IParameter } from "@/models";
import { useStore } from "@/stores";

// todo refactor source functions
export const useApiDataSource = () => {
  const { json } = useStore();
  const { definitions } = json;

  const dataSource = (ref: string): IApiProperty[] => {
    const _definition = definitions[ref];
    const res: IApiProperty[] = [];
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
        mock: "",
      });
    }
    return res;
  };

  const paramsSource = (params: IParameter[]) => {
    const res: IApiProperty[] = [];
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
            mock: "",
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
          mock: "",
        });
      }
    }
    return res;
  };

  const getRef = (record: IApiProperty): string => {
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
