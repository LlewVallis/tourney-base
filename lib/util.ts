export function error(message: object | string | undefined = undefined): never {
  if (message instanceof Object) {
    throw message;
  } else {
    throw new Error(message);
  }
}

export function castString(value: unknown): string {
  if (typeof value === "string") {
    return value;
  } else {
    error("not a string");
  }
}
