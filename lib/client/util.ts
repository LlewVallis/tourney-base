import { RefObject } from "react";

export function cleanedValue(ref: RefObject<HTMLInputElement>): string {
  return ref.current!!.value.trim();
}
