

import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { TState, TStateGet } from "../utils/types/schemas";
import action from "./actions";
import payload from "./payload";

/**
 * A Zustand slice function.
 *
 * @template T - The shape of the state returned by the slice.
 * @param set - Zustand's `set` function used to update state.
 * @param get - Zustand's `get` function used to access current state.
 * @returns A partial state object implementing the shape of `T`.
 */
type Slice<T> = (set: TState<any>, get: TStateGet<any>) => T;

/**
 * Merges the return types of an array of Zustand slice functions into a single type.
 *
 * This allows TypeScript to infer the final store state from all slice return types.
 *
 * @template Slices - An array of Zustand slice functions.
 */
type MergeSlices<Slices extends readonly Slice<any>[]> =
  Slices extends readonly [...infer Rest]
  ? Rest extends Slice<infer R>[]
  ? UnionToIntersection<R>
  : never
  : never;

/**
 * Converts a union type (e.g., A | B | C) into an intersection type (A & B & C).
 *
 * This utility is a TypeScript trick that distributes over union types and infers
 * a combined type where all members must be satisfied simultaneously.
 *
 * @template U - A union type to be converted into an intersection.
 */
type UnionToIntersection<U> =
  (U extends any ? (x: U) => any : never) extends
  (x: infer R) => any ? R : never;

/**
 * Combines multiple Zustand slice functions into a single initializer.
 *
 * Each slice receives Zustand's `set` and `get` functions and returns a partial state.
 * This function merges all slice outputs into one complete state object.
 *
 * @template Slices - A tuple of slice functions.
 * @param slices - Any number of Zustand-compatible slice functions.
 * @returns A single function that initializes the full Zustand store by combining slices.
 */
export function combinedSlices<Slices extends readonly Slice<any>[]>(...slices: Slices) {
  return function (set: TState<MergeSlices<Slices>>, get: TStateGet<MergeSlices<Slices>>) {
    return Object.assign({}, ...slices.map((fn) => fn(set, get))) as MergeSlices<Slices>;
  };
}

// Here we combine various state slices together into one. Then we feed it to zustand create.
const combinedState = combinedSlices(payload, action);

/**
 * The unified Zustand store combining all application state slices.
 *
 * Combines `payload` and `action` slices using `combineSlices`, and enhances it with
 * Zustand middleware (e.g., `subscribeWithSelector`) for optimized reactivity.
 *
 * Provides full autocomplete and type safety based on inferred slice return types.
 */
export const useAppState = create(
  subscribeWithSelector(combinedState),
);

export type AppState = ReturnType<typeof combinedState>
export type IPayload = ReturnType<typeof payload>
export type IAction = ReturnType<typeof action>
