// src/test/setup.ts
import { Assertion } from "vitest";

declare global {
  let expect: (value: unknown) => Assertion;
  interface Window {
    expect: (value: unknown) => Assertion;
  }
}
