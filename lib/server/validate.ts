import Ajv, { JSONSchemaType, SchemaObject, ValidateFunction } from "ajv";

const ajv = new Ajv();

const validators = new WeakMap<SchemaObject, ValidateFunction<unknown>>();

export default function validate<T>(
  schema: JSONSchemaType<T>,
  value: unknown
): value is T {
  if (!validators.has(schema)) {
    const validator = ajv.compile(schema);
    validators.set(schema, validator);
  }

  const validator = validators.get(schema)!! as ValidateFunction<
    JSONSchemaType<T>
  >;

  return validator(value);
}
