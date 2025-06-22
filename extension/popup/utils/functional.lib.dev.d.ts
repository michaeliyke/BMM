
declare module './functional.lib.dev' {

  /**
   * Compose two functions from right to left.
   *
   * The output of `fn2` is passed as input to `fn1`.
   * The execution order is f1(f2(...initialArgs));
   *
   * @template A - Argument type of the last function (`fn2`),  which is the first to be executed.
   * @template B - Output type of `fn2` and input type of `fn1`.
  * @template R - Output type of `fn1` and the final return type of the composed function.
   *
   * @param fn1 - The first function in the`compose` call, which is the leftmost (last to be executed).It accepts`B` and returns`R`.
   * @param fn2 - The second (last) function in the`compose` call, which is the rightmost (first to be executed).It accepts variadic arguments`A` and returns`B`.
   *
   * @returns A new function that accepts the initial variadic arguments`A` and returns`R`.
   *
   * @example
   * ```ts
   * const addOne = (x: number) => x + 1;
   * const double = (x: number) => x * 2;
   * const composed = compose(addOne, double);
   * composed(3); // addOne(double(3)) => addOne(6) => 7
   * ```
   */
  export function compose<A extends unknown[], B, R>(
    fn1: (b: B) => R,
    fn2: (...initialArgs: A) => B
  ): (...fns: A) => R;

  /**
 * Compose three functions from right to left.
 *
 * The output of `fn3` is passed to `fn2`, and the output of `fn2` to `fn1`.
 * The execution order is f1(f2(f3(...initialArgs)));
 *
 * @template A - Argument type of the last function (`fn3`),  which is the first to be executed.
 * @template B - Output type of `fn3` and input type of `fn2`.
 * @template C - Output type of `fn2` and input type of `fn1`.
 * @template R - Output type of `fn1` and the final return type of the composed function.
 *
 * @param fn1 - The first function in the `compose` call, which is the leftmost (last to be executed). It accepts `C` and returns `R`.
 * @param fn2 - The second function in the `compose` call. It accepts `C` and returns `D`.
 * @param fn3 - The third (last) function in the `compose` call, which is the rightmost (first to be executed). It accepts variadic arguments `A` and returns `B`.
 *
 * @returns A new function that accepts the initial variadic arguments `A` and returns `R`.
 */
  export function compose<A extends unknown[], B, C, R>(
    fn1: (c: C) => R, // Unary, produces final result
    fn2: (b: B) => C,
    fn3: (...inputArgs: A) => B // Variadic, receives initial arguments
  ): (...fns: A) => R; // Takes variable args of A type, returns R type (inferred from results)

  /**
 * Composes four functions from right to left.
 *
 * The output of `fn4` is passed to `fn3`, the output of `fn3` to `fn2`, and so on.
 * The execution order is `fn1(fn2(fn3(fn4(...initialArgs))))`.
 *
 * @template A - Argument types of the last function (`fn4`), which is the first to be executed.
 * @template B - Output type of `fn4` and input type of `fn3`.
 * @template C - Output type of `fn3` and input type of `fn2`.
 * @template D - Output type of `fn2` and input type of `fn1`.
 * @template R - Output type of `fn1` and the final return type of the composed function.
 *
 * @param fn1 - The first function in the `compose` call, which is the leftmost (last to be executed). It accepts `D` and returns `R`.
 * @param fn2 - The second function in the `compose` call. It accepts `C` and returns `D`.
 * @param fn3 - The third function in the `compose` call. It accepts `B` and returns `C`.
 * @param fn4 - The fourth (last) function in the `compose` call, which is the rightmost (first to be executed). It accepts variadic arguments `A` and returns `B`.
 *
 * @returns A new function that accepts the initial variadic arguments `A` and returns `R`.
 */
  export function compose<A extends unknown[], B, C, D, R>(
    fn1: (d: D) => R,       // Unary, produces final result
    fn2: (c: C) => D,
    fn3: (b: B) => C,
    fn4: (...initialArgs: A) => B  // Variadic, receives initial arguments
  ): (...fns: A) => R;  // Takes variable args of A type, returns R type (inferred from results)


  /**
 * `ComposeArgs` is a helper type that infers the argument types of the *rightmost* function
 * in a tuple of functions (`T`). This is crucial for a standard right-to-left `compose` function,
 * as the composed function's arguments are determined by the first function executed in the chain.
 *
 * It works by recursively destructuring the tuple of functions:
 * - **Base Case (Empty Tuple):** If `T` is an empty array (`[]`), it means there are no functions to compose,
 * so the arguments are an empty tuple `[]`.
 * - **Base Case (Single Function):** If `T` contains only one function (`[infer F]`), the arguments
 * of the composed function are simply the `Parameters` of that single function `F`.
 * - **Recursive Case (Multiple Functions):** If `T` contains multiple functions (`[...infer Init, infer Last]`),
 * it means the `Last` function in the tuple is the rightmost function in the composition.
 * Therefore, the arguments of the composed function are the `Parameters` of this `Last` function.
 *
 * @template T - A `readonly` tuple of functions. This represents the `Fns` type parameter
 * from the main `compose` function, containing all functions passed to `compose`.
 * @returns A tuple type representing the arguments that the final composed function will accept.
 * This will match the arguments of the rightmost function in the input `T` tuple.
 */
  type ComposeArgs<T extends readonly ((...args: any) => any)[]> = T extends readonly []
    ? []
    : T extends readonly [infer F extends (...args: any) => any]
    ? Parameters<F>

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    : T extends readonly [...infer Init, infer Last extends (...args: any) => any]
    ? Parameters<Last>
    : never;

  /**
  * `ComposeReturn` is a helper type that recursively infers the final return type of a
  * standard right-to-left function composition. It traces the output of each function
  * as it becomes the input of the next, from right to left.
  *
  * It works by recursively destructuring the tuple of functions:
  * - **Base Case (Empty Tuple):** If `T` is an empty array (`[]`), the return type is `any`,
  * representing an identity-like behavior for an empty composition.
  * - **Base Case (Single Function):** If `T` contains only one function (`[infer F]`), the
  * return type of the composed function is simply the `ReturnType` of that single function `F`.
  * - **Recursive Case (Multiple Functions):** If `T` contains multiple functions (`[...infer Init, infer Last]`),
  * this is the core of the right-to-left chaining:
  * 1. It first recursively calls `ComposeReturn<Init>` to determine the return type of
  * the composition of all functions *except* the `Last` one. This intermediate result
  * is inferred as `R`.
  * 2. The `ReturnType` of the *first* function in the original `T` tuple (which is `T[0]`)
  * is then returned. This is because, in a right-to-left composition, the first function
  * in the `fns` list is the *last* one to execute, and its return type is the final output.
  *
  * @template T - A `readonly` tuple of functions. This represents the `Fns` type parameter
  * from the main `compose` function, containing all functions passed to `compose`.
  * @returns The final return type of the composed function after all functions in the
  * `T` tuple have been applied from right to left.
  */
  type ComposeReturn<T extends readonly ((...args: any) => any)[]> = T extends readonly []
    ? any
    : T extends readonly [infer F extends (...args: any) => any]
    ? ReturnType<F>

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    : T extends readonly [...infer Init extends readonly ((...args: any) => any)[], infer Last extends ((...args: any) => any)]
    ? ReturnType<
      ComposeReturn<Init> extends infer R
      ? R extends (...args: any) => infer U
      ? U
      : R
      : never
    >
    : never;


  /**
   * Composes multiple functions from right to left (standard composition).
   *
   * This generic signature handles any number of functions passed to `compose`.
   *
   * The execution order is `f1(f2(f3(...(fN(...initialArgs))...)))`.
   * This means:
   * 1. The **last function passed to `compose` (`fN`)** is executed first. It can be variadic and receives the initial arguments.
   * 2. Its result is passed as a single argument to the second-to-last function (`fN-1`).
   * 3. This chaining continues until the result reaches the **first function passed to `compose` (`f1`)**.
   * 4. The output of `f1` is the final result of the composed function.
   *
   * @template Fns - A tuple type representing the array of functions to compose.
   * @param {...Fns} fns - The functions to compose, listed in the order from leftmost (last executed) to rightmost (first executed).
   *
   * @returns A new function that takes the initial arguments of the rightmost function (`fN`) and returns the final result of the leftmost function (`f1`).
   *
   * @example
   * ```ts
   * function sum(a: number, b: number): number { return a + b; }
   * function square(x: number): number { return x * x; }
   * function toString(x: number): string { return String(x); }
   *
   * // Standard composition: toString(square(sum(2, 3)))
   * // Call sequence in compose: toString (f1) , square (f2), sum (f3 / fN)
   * const composed = compose(toString, square, sum);
   *
   * // Execution trace when composed(2, 3) is called:
   * // 1. `sum(2, 3)`          => returns 5
   * // 2. `square(5)`          => returns 25
   * // 3. `toString(25)`       => returns "25"
   * const result = composed(2, 3);
   * console.log(result); // "25"
   * ```
   */
  export function compose<Fns extends readonly ((...args: any) => any)[]>(
    ...fns: Fns
  ): (...args: ComposeArgs<Fns>) => ComposeReturn<Fns>;

  /**
 * Removes circular references from an object by breaking cycles.
 *
 * This function processes the input object and returns a new object
 * where all circular references are replaced or removed to prevent
 * infinite loops during serialization or deep copying.
 *
 * Useful for handling global objects or complex structures with circular
 * references, such as the `global` object in Node.js, which includes
 * self-referential properties.
 *
 * @template T - The type of the input object.
 * @param obj - The object that may contain circular references.
 * @returns A new object with the same shape as `obj`, but without circular references.
 *
 * @example
 * ```ts
 * const circularObj: any = {};
 * circularObj.self = circularObj;
 *
 * const safeObj = noCircles(circularObj);
 * // safeObj.self will be removed or replaced to avoid circularity
 * ```
 */
  export function deCycle<T>(obj: T): T;

  /** Use unary to make any function accept a maximum of one argument
   *
   * It's a handy utility for ensuring functions receive precisely one input, even if they were
   * originally designed to handle more.
   *
   * @template A The type of the single argument the returned function will accept.
   * @template R The return type of the original function and the new unary function.
   * @param {(argument: A, ...args: unknown[]) => R} fn The function to make unary.
   * It can originally accept multiple arguments,
   * but only the first will be used by the returned function.
   * @returns {(argument: A) => R} A new function that accepts only one argument
   * and calls the original function with that argument.
   */
  export function unary<A, R>(
    fn: (argument: A, ...args: unknown[]) => R
  ): (argument: A) => R;



  /**
   * Pipes two functions from left to right.
   *
   * The output of `fn1` is passed as input to `fn2`.
   * The execution order is f2(f1(...initialArgs));
   *
   * @template A - Argument types for the first function.
   * @template B - Output type of `fn1` and input type of `fn2`.
   * @template R - Output type of `fn2` and the final return type.
   *
   * @param fn1 - The first function in the pipe (leftmost, first to execute). It accepts variadic arguments `A` and returns `B`.
   * @param fn2 - The second function in the pipe (rightmost, last to execute). It accepts `B` and returns `R`.
   *
   * @returns A new function that accepts the initial variadic arguments `A` and returns `R`.
   *
   * @example
   * ```ts
   * const addOne = (x: number) => x + 1;
   * const double = (x: number) => x * 2;
   * const piped = pipe(addOne, double);
   * piped(3); // double(addOne(3)) => double(4) => 8
   * ```
   */
  export function pipe<A extends unknown[], B, R>(
    fn1: (...initialArgs: A) => B,
    fn2: (b: B) => R
  ): (...args: A) => R;

  /**
   * Pipes three functions from left to right.
   *
   * The output of `fn1` is passed to `fn2`, and the output of `fn2` to `fn3`.
   * The execution order is f3(f2(f1(...initialArgs)));
   *
   * @template A - Argument types for the first function.
   * @template B - Output type of `fn1` and input type of `fn2`.
   * @template C - Output type of `fn2` and input type of `fn3`.
   * @template R - Output type of `fn3` and the final return type.
   *
   * @param fn1 - The first function in the pipe (leftmost, first to execute). It accepts variadic arguments `A` and returns `B`.
   * @param fn2 - The second function in the pipe. It accepts `B` and returns `C`.
   * @param fn3 - The third function in the pipe (rightmost, last to execute). It accepts `C` and returns `R`.
   *
   * @returns A new function that accepts the initial variadic arguments `A` and returns `R`.
   */
  export function pipe<A extends unknown[], B, C, R>(
    fn1: (...initialArgs: A) => B,
    fn2: (b: B) => C,
    fn3: (c: C) => R
  ): (...args: A) => R;

  /**
   * Pipes four functions from left to right.
   *
   * The output flows from `fn1` through `fn2`, `fn3`, and finally to `fn4`.
   * The execution order is f4(f3(f2(f1(...initialArgs))));
   *
   * @template A - Argument types for the first function.
   * @template B - Output type of `fn1` and input type of `fn2`.
   * @template C - Output type of `fn2` and input type of `fn3`.
   * @template D - Output type of `fn3` and input type of `fn4`.
   * @template R - Output type of `fn4` and the final return type.
   *
   * @param fn1 - The first function in the pipe (leftmost, first to execute). It accepts variadic arguments `A` and returns `B`.
   * @param fn2 - The second function in the pipe. It accepts `B` and returns `C`.
   * @param fn3 - The third function in the pipe. It accepts `C` and returns `D`.
   * @param fn4 - The fourth function in the pipe (rightmost, last to execute). It accepts `D` and returns `R`.
   *
   * @returns A new function that accepts the initial variadic arguments `A` and returns `R`.
   */
  export function pipe<A extends unknown[], B, C, D, R>(
    fn1: (...initialArgs: A) => B,
    fn2: (b: B) => C,
    fn3: (c: C) => D,
    fn4: (d: D) => R
  ): (...args: A) => R;

  /**
   * Pipes multiple functions from left to right (standard pipeline).
   *
   * This generic signature handles any number of functions passed to `pipe`.
   *
   * The execution order is `fN(...(f3(f2(f1(...initialArgs)))))`.
   * This means:
   * 1. The **first function passed to `pipe` (`f1`)** is executed first. It can be variadic and receives the initial arguments.
   * 2. Its result is passed as a single argument to the second function (`f2`).
   * 3. This chaining continues until the result reaches the **last function passed to `pipe` (`fN`)**.
   * 4. The output of `fN` is the final result of the piped function.
   *
   * @template Fns - A tuple type representing the array of functions to pipe.
   * @param {...Fns} fns - The functions to pipe, listed in order from first executed (leftmost) to last executed (rightmost).
   *
   * @returns A new function that takes the initial arguments for the first function and returns the final result.
   *
   * @example
   * ```ts
   * function sum(a: number, b: number): number { return a + b; }
   * function square(x: number): number { return x * x; }
   * function toString(x: number): string { return String(x); }
   *
   * // Standard pipeline: toString(square(sum(2, 3)))
   * const piped = pipe(sum, square, toString);
   *
   * // Execution trace when piped(2, 3) is called:
   * // 1. `sum(2, 3)`          => returns 5
   * // 2. `square(5)`          => returns 25
   * // 3. `toString(25)`       => returns "25"
   * const result = piped(2, 3);
   * console.log(result); // "25"
   * ```
   */
  export function pipe<Fns extends readonly ((...args: unknown[]) => unknown)[]>(
    ...fns: Fns
  ): (...args: Parameters<Fns[0]>) => ReturnType<Fns[number]>;

  /**
   * Transforms a function of multiple arguments into a sequence of functions each taking a single argument.
   *
   * The curried function can be called with fewer arguments than the original function requires,
   * returning a new function that accepts the remaining arguments.
   *
   * @template Args - A tuple of argument types for the original function
   * @template R - The return type of the original function
   * @param fn - The function to curry
   * @returns A curried version of the input function
   *
   * @example
   * ```ts
   * const add = (a: number, b: number, c: number) => a + b + c;
   * const curriedAdd = curry(add);
   *
   * // These all return 6
   * curriedAdd(1)(2)(3);
   * curriedAdd(1, 2)(3);
   * curriedAdd(1)(2, 3);
   * curriedAdd(1, 2, 3);
   * ```
   */
  export function curry<Args extends unknown[], R>(
    fn: (...args: Args) => R
  ): Args['length'] extends 0
    ? () => R
    : Args['length'] extends 1
    ? (arg: Args[0]) => R
    : CurriedFunction<Args, R>;

  /**
   * Helper type for creating curried function types of arbitrary arity.
   */
  type CurriedFunction<Args extends unknown[], R> = <T extends unknown[]>(
    ...args: T
  ) => T['length'] extends Args['length']
    ? R
    : T['length'] extends 0
    ? CurriedFunction<Args, R>
    : CurriedFunction<Drop<Args, T['length']>, R>;

  /**
   * Helper type that drops N elements from the beginning of a tuple type.
   */
  type Drop<T extends unknown[], N extends number, I extends unknown[] = []> = I['length'] extends N
    ? T
    : T extends [unknown, ...infer U]
    ? Drop<U, N, [...I, unknown]>
    : [];

  /**
   * Transforms a curried function back into one that takes multiple arguments at once.
   * This is the reverse operation of curry.
   *
   * @template Args - A tuple of argument types for the uncurried function
   * @template R - The return type of both the curried and uncurried functions
   * @param curriedFn - The curried function to transform
   * @returns A function that accepts all arguments at once instead of one at a time
   *
   * @example
   * ```ts
   * const curriedAdd = (a: number) => (b: number) => (c: number) => a + b + c;
   * const add = uncurry(curriedAdd);
   * add(1, 2, 3); // returns 6
   * ```
   */
  export function uncurry<Args extends unknown[], R>(
    curriedFn: (first: Args[0]) => (...args: Args extends [any, ...infer Rest] ? Rest : never) => R
  ): (...args: Args) => R;

  /**
   * Uncurry overload for nested curried functions of specific depth
   */
  export function uncurry<A, B, R>(
    curriedFn: (a: A) => (b: B) => R
  ): (a: A, b: B) => R;

  /**
   * Uncurry overload for nested curried functions of specific depth
   */
  export function uncurry<A, B, C, R>(
    curriedFn: (a: A) => (b: B) => (c: C) => R
  ): (a: A, b: B, c: C) => R;

  /**
   * Uncurry overload for nested curried functions of specific depth
   */
  export function uncurry<A, B, C, D, R>(
    curriedFn: (a: A) => (b: B) => (c: C) => (d: D) => R
  ): (a: A, b: B, c: C, d: D) => R;

  /**
   * Pre-fills a function with some of its arguments ahead of time.
   * Arguments passed to the returned function come after the preset arguments.
   *
   * @template PresetArgs - A tuple of argument types for the preset arguments
   * @template RemainingArgs - A tuple of argument types for the remaining arguments
   * @template R - The return type of the input function
   * @param fn - The function to be partially applied
   * @param presetArgs - Arguments to be preset on the left side
   * @returns A new function that, when called, combines the preset arguments with the call-time ones
   *
   * @example
   * ```ts
   * const greet = (greeting: string, name: string) => `${greeting}, ${name}!`;
   * const sayHello = partial(greet, "Hello");
   * sayHello("World"); // returns "Hello, World!"
   * ```
   */
  export function partial<PresetArgs extends unknown[], RemainingArgs extends unknown[], R>(
    fn: (...args: [...PresetArgs, ...RemainingArgs]) => R,
    ...presetArgs: PresetArgs
  ): (...args: RemainingArgs) => R;

  /**
   * Pre-fills a function with arguments to the right of the ones from call site.
   * Arguments passed to the returned function come before the preset arguments.
   *
   * @template Args - A tuple of argument types for the input function
   * @template PresetArgs - A tuple of argument types for the preset arguments
   * @template R - The return type of the input function
   * @param fn - The function to be partially applied
   * @param presetArgs - Arguments to be preset on the right side
   * @returns A new function that, when called, combines the call-time arguments with the preset ones
   *
   * @example
   * ```ts
   * const divide = (a: number, b: number) => a / b;
   * const divideBy10 = partialRight(divide, 10);
   * divideBy10(50); // returns 5 (50 / 10)
   * ```
   */
  export function partialRight<Args extends unknown[], PresetArgs extends unknown[], R>(
    fn: (...args: [...Args, ...PresetArgs]) => R,
    ...presetArgs: PresetArgs
  ): (...args: Args) => R;

  /**
   * Creates a function that negates the result of the predicate function.
   *
   * @template T - The input type to the predicate function
   * @param predicate - The predicate function to negate
   * @returns A new function that returns the logical negation of the predicate
   *
   * @example
   * ```ts
   * const isEven = (n: number) => n % 2 === 0;
   * const isOdd = not(isEven);
   * isOdd(3); // returns true
   * isOdd(4); // returns false
   * ```
   */
  export function not<T>(predicate: (value: T) => boolean): (value: T) => boolean;

  /**
   * Returns a new array with duplicate elements removed.
   *
   * @template T - The type of elements in the array
   * @param array - The input array that may contain duplicates
   * @returns A new array containing only unique elements
   *
   * @example
   * ```ts
   * unique([1, 2, 2, 3, 3, 3, 4]); // returns [1, 2, 3, 4]
   * ```
   */
  export function unique<T>(array: readonly T[]): T[];

  /**
   * Creates a function that conditionally executes a handler when the predicate returns true.
   * If the predicate returns false, the input is returned unchanged.
   *
   * @template T - The input type to both the predicate and handler functions
   * @template R - The return type of the handler function
   * @param predicate - A function that determines whether to execute the handler
   * @param handler - The function to execute when predicate returns true
   * @returns A new function that conditionally applies the handler
   *
   * @example
   * ```ts
   * const doubleIfEven = when(
   *   (n: number) => n % 2 === 0,
   *   (n: number) => n * 2
   * );
   * doubleIfEven(4); // returns 8
   * doubleIfEven(5); // returns 5 (unchanged)
   * ```
   */
  export function when<T, R>(
    predicate: (value: T) => boolean,
    handler: (value: T) => R
  ): (value: T) => T | R;

  /**
   * Transforms a function that accepts multiple arguments into one that accepts a single array containing all arguments.
   *
   * @template Args - A tuple of argument types for the input function
   * @template R - The return type of the input function
   * @param fn - The function that expects multiple arguments
   * @returns A new function that accepts a single array of arguments
   *
   * @example
   * ```ts
   * const sum = (a: number, b: number, c: number) => a + b + c;
   * const arraySum = gatherArgs(sum);
   * arraySum([1, 2, 3]); // returns 6
   * ```
   */
  export function gatherArgs<Args extends unknown[], R>(
    fn: (...args: Args) => R
  ): (argsArray: Args) => R;

  /**
   * Transforms a function that accepts a single array argument into one that accepts multiple arguments.
   * The multiple arguments will be gathered into an array and passed to the original function.
   *
   * @template Args - A tuple of argument types
   * @template R - The return type of the input function
   * @param fn - The function that expects an array of arguments
   * @returns A new function that accepts multiple arguments
   *
   * @example
   * ```ts
   * const sumArray = (nums: number[]) => nums.reduce((a, b) => a + b, 0);
   * const sum = spreadArgs(sumArray);
   * sum(1, 2, 3, 4); // returns 10
   * ```
   */
  export function spreadArgs<Args extends unknown[], R>(
    fn: (argsArray: Args) => R
  ): (...args: Args) => R;

  /**
   * Reverses the order of arguments passed to a function.
   *
   * @template Args - A tuple of argument types for the input function
   * @template R - The return type of the input function
   * @param fn - The function whose argument order should be reversed
   * @returns A new function that accepts the same arguments but in reverse order
   *
   * @example
   * ```ts
   * const divide = (a: number, b: number) => a / b;
   * const reversedDivide = reverseArgs(divide);
   * divide(10, 2); // returns 5
   * reversedDivide(2, 10); // returns 5
   * ```
   */
  export function reverseArgs<Args extends unknown[], R>(
    fn: (...args: Args) => R
  ): (...args: Reverse<Args>) => R;

  /**
   * Forces a function to accept only two arguments at most.
   * Any additional arguments provided will be ignored.
   *
   * @template A - Type of the first argument
   * @template B - Type of the second argument
   * @template R - The return type of the function
   * @param fn - The function to restrict to binary operation
   * @returns A new function that accepts at most two arguments
   *
   * @example
   * ```ts
   * const sum = (...nums: number[]) => nums.reduce((acc, n) => acc + n, 0);
   * const binarySum = binary(sum);
   * sum(1, 2, 3, 4); // returns 10
   * binarySum(1, 2, 3, 4); // returns 3 (only uses first two arguments)
   * ```
   */
  export function binary<A, B, R>(
    fn: (a: A, b: B, ...args: unknown[]) => R
  ): (a: A, b: B) => R;

  /**
   * Helper type for reversing the order of a tuple's elements.
   * Used by the reverseArgs function.
   */
  type Reverse<T extends unknown[]> = T extends []
    ? []
    : T extends [infer First, ...infer Rest]
    ? [...Reverse<Rest>, First]
    : never;

  /**
   * Filters an array to include only elements that satisfy the predicate function.
   * This is an alias for the `filter` function.
   *
   * @template T - The type of elements in the input array
   * @param predicate - A function that tests each element and returns a boolean
   * @param arr - The array to filter
   * @returns A new array containing only the elements that satisfy the predicate
   *
   * @example
   * ```ts
   * filterIn(x => x > 5, [3, 8, 2, 10]); // returns [8, 10]
   * ```
   */
  export function filterIn<T>(predicate: (value: T) => boolean, arr: readonly T[]): T[];

  /**
   * Filters an array to exclude elements that satisfy the predicate function.
   * This is the inverse of the `filter`/`filterIn` function.
   *
   * @template T - The type of elements in the input array
   * @param predicate - A function that tests each element for exclusion
   * @param arr - The array to filter
   * @returns A new array containing only the elements that do NOT satisfy the predicate
   *
   * @example
   * ```ts
   * filterOut(x => x > 5, [3, 8, 2, 10]); // returns [3, 2]
   * ```
   */
  export function filterOut<T>(predicate: (value: T) => boolean, arr: readonly T[]): T[];

  /**
   * Filters an array to include only elements that satisfy the predicate function.
   *
   * @template T - The type of elements in the input array
   * @param predicate - A function that tests each element and returns a boolean
   * @param arr - The array to filter
   * @returns A new array containing only the elements that satisfy the predicate
   *
   * @example
   * ```ts
   * filter(x => x > 5, [3, 8, 2, 10]); // returns [8, 10]
   * ```
   */
  export function filter<T>(predicate: (value: T) => boolean, arr: readonly T[]): T[];

  /**
   * A utility function that returns its input argument unchanged.
   *
   * @template T - The type of the input value
   * @param value - The value to return
   * @returns The same value that was passed in
   *
   * @example
   * ```ts
   * identity(5); // returns 5
   * identity("hello"); // returns "hello"
   * identity({ key: "value" }); // returns { key: "value" }
   * ```
   */
  export function identity<T>(value: T): T;

  // Export all console function types
  export const assert: Console['assert'];
  export const clear: Console['clear'];
  export const count: Console['count'];
  export const countReset: Console['countReset'];
  export const debug: Console['debug'];
  export const dir: Console['dir'];
  export const dirxml: Console['dirxml'];
  export const error: Console['error'];
  export const group: Console['group'];
  export const groupCollapsed: Console['groupCollapsed'];
  export const groupEnd: Console['groupEnd'];
  export const info: Console['info'];
  export const log: Console['log'];
  export const table: Console['table'];
  export const time: Console['time'];
  export const timeEnd: Console['timeEnd'];
  export const timeLog: Console['timeLog'];
  export const timeStamp: Console['timeStamp'];
  export const trace: Console['trace'];
  export const warn: Console['warn'];
}

export { };
