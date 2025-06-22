/**
 * @fileoverview A comprehensive functional programming utility library
 * Provides a collection of pure functions for functional programming patterns
 * including composition, currying, partial application, and function transformation.
 */

/**
 * Returns the input value unchanged
 * @template T
 * @param {T} value - The value to return
 * @returns {T} The same value
 */
export function identity(value) {
  return value;
}

/**
 * Implements trampoline-based recursion to prevent stack overflow
 * Instead of functions calling functions directly, each function returns the next
 * function to be called. A loop runs each returned function until there are no more.
 * Advantages:
 * - Works in environments without PTC (Proper Tail Calls)
 * - May run faster as each call is regular, not PTC optimized
 * @param {Function} fn - The function to trampoline
 * @returns {Function} A trampolined version of the input function
 */
export function trampoline(fn) {
  return function trampolined(...args) {
    var result = fn(...args);

    while (typeof result === "function") {
      result = result();
    }

    return result;
  };
}

/**
 * Converts a character to uppercase
 * @param {string} c - Single character to convert
 * @returns {string} Uppercase version of the character
 */
export function uppercaseLetter(c) {
  var code = c.charCodeAt(0);

  if (code >= 97 && code <= 122) {
    code = code - 32;
  }

  return String.fromCharCode(code);
}

/**
 * Filters an array based on a predicate function
 * @template T
 * @param {function(T, number, T[]): boolean} predicate - Function to test each element
 * @param {T[]} arr - Array to filter
 * @returns {T[]} New array with elements that pass the test
 */
export function filter(predicate, arr) {
  var newList = [];

  for (let [index, value] of arr.entries()) {
    if (predicate(value, index, arr)) {
      newList.push(value);
    }

    return newList;
  }
}

/**
 * Filters an array using reduce for better performance
 * @template T
 * @param {function(T): boolean} predicate - Function to test each element
 * @param {T[]} items - Array to filter
 * @returns {T[]} New array with elements that pass the test
 */
export function filterReduce(predicate, items) {
  return items.reduce(function filterer(result, next) {
    return predicate(next) ? result.concat(next) : result;
  }, []);
}

/**
 * Maps over an array applying a transformation function
 * @template T,U
 * @param {function(T, number, T[]): U} mapper - Function to transform each element
 * @param {T[]} items - Array to map over
 * @returns {U[]} New array with transformed elements
 */
export function map(mapper, items) {
  let newList = [];
  for (let [index, value] of items.entries()) {
    newList.push(mapper(value, index, items));
  }
  return newList;
}

/**
 * Alias for filter function
 * @template T
 * @param {function(T, number, T[]): boolean} predicate - Function to test each element
 * @param {T[]} arr - Array to filter
 * @returns {T[]} New array with elements that pass the test
 */
export function filterIn(predicate, arr) {
  return filter(predicate, arr);
}

/**
 * Filters out elements that match the predicate
 * @template T
 * @param {function(T, number, T[]): boolean} predicate - Function to test each element
 * @param {T[]} arr - Array to filter
 * @returns {T[]} New array with elements that don't pass the test
 */
export function filterOut(predicate, arr) {
  return filter(not(predicate), arr);
}

/**
 * Reduces an array to a single value
 * @template T,U
 * @param {function(U, T, number, T[]): U} predicate - Reducer function
 * @param {U} init - Initial value
 * @param {T[]} arr - Array to reduce
 * @throws {Error} If predicate is not a function or array is empty
 * @returns {U} Final accumulated value
 */
export function reduce(predicate, init, arr) {
  const items = arr || init;
  const startIndex = arguments.length === 3 ? 0 : 1;
  let accumulator;

  if (typeof predicate !== "function")
    throw new Error("A predicate function is required");
  if (!Array.isArray(items) || items.length === 0)
    throw new Error("An array with at least one item is required");

  accumulator = arguments.length === 3 ? init : items[0];

  for (let index = startIndex; index < items.length; index++)
    accumulator = predicate(accumulator, items[index], index, items);

  return accumulator;
}

/**
 * Finds the maximum even number in a list using a loop
 * @param {...number} nums - The numbers to evaluate
 * @returns {number|undefined} The maximum even number, or undefined if there are none
 */
export function maxEvenLoop(...nums) {
  var maxNum = -Infinity;

  for (let num of nums) {
    if (num % 2 === 0 && num > maxNum) {
      maxNum = num;
    }
  }

  if (maxNum !== -Infinity) {
    return maxNum;
  }
}

/**
 * Finds the maximum even number in a list using recursion
 * @param {number} num1 - The first number
 * @param {...number} restNums - The rest of the numbers
 * @returns {number|undefined} The maximum even number, or undefined if there are none
 */
export function maxEven(num1, ...restNums) {
  var maxRest = restNums.length > 0 ? maxEven(...restNums) : undefined;

  return (num1 % 2 !== 0 || num1 < maxRest) ? maxRest : num1;
}

/**
 * Calculates the depth of a binary tree
 * @param {Object} node - The current node
 * @param {Object} node.left - The left child
 * @param {Object} node.right - The right child
 * @returns {number} The depth of the tree
 */
export function depth(node) {
  if (node) {
    let depthLeft = depth(node.left);
    let depthRight = depth(node.right);

    return 1 + max(depthLeft, depthRight);
  }

  return 0;
}

/**
 * Part A of the composite Fibonacci function (CPS)
 * @param {number} n - The input number
 * @returns {number} The Fibonacci number at position n
 */
export function fibCompositeA(n) {
  return n === 1 ? 1 : fibCompositeB(n - 2);
}

/**
 * Part B of the composite Fibonacci function (CPS)
 * @param {number} n - The input number
 * @returns {number} The Fibonacci number at position n
 */
export function fibCompositeB(n) {
  return n === 0 ? 0 : fibCompositeB(n - 1) + fibCompositeA(n);
}

/**
 * Continuation Passing Style (CPS) Fibonacci
 * @param {number} n - The input number
 * @param {function(number): T} [cont=identity] - The continuation function
 * @template T
 * @returns {T} The Fibonacci number at position n
 */
export function fib(n, cont = identity) {
  if (n <= 1) return cont(n);
  return fib(n - 2, (n2) => fib(n - 1, (n1) => cont(n2 + n1)));
}

/**
 * Composes functions from left to right
 * @param {...function} fns - The functions to compose
 * @returns {function} A function that is the composition of the input functions
 */
export function composeLoop(...fns) {
  return function composed(result) {
    var list = [...fns];
    while (list.length > 0) {
      result = list.pop()(result);
    }
    return result;
  };
}

/**
 * Composes functions from right to left (non-lazy)
 * @param {...function} fns - The functions to compose
 * @returns {function} A function that is the composition of the input functions
 */
export function composeNonLazy(...fns) {
  return function composed(result) {
    return fns.reduceRight(function composer(result, fn) {
      return fn(result);
    }, result);
  };
}

/**
 * Composes functions recursively
 * @param {...function} fns - The functions to compose
 * @returns {function} A function that is the composition of the input functions
 */
export function composeRecursive(...fns) {
  var [fn1, fn2, ...rest] = fns.reverse(); // pull off the last two arguments
  var composedFn = function composed(...args) {
    return fn2(fn1(...args));
  };
  return rest.length === 0 ? composedFn : compose(...rest.reverse(), composedFn);
}

/**
 * Reducer function for use with reduce
 * @param {function} fn1 - The first function
 * @param {function} fn2 - The second function
 * @returns {function} A function that is the composition of the two input functions
 */
export function reducer(fn1, fn2) { // Two reduce functions
  // must return a function as result so fn1 continues to be a function
  return function reduced(arg) {
    return fn2(fn1(arg));
  };
}

/**
 * Composer function for use with reduce
 * @param {function} fn1 - The first function
 * @param {function} fn2 - The second function
 * @returns {function} A function that is the composition of the two input functions
 */
export function composer(fn1, fn2) { // Two reduce functions
  // must return a function as result so fn1 continues to be a function
  return function composed(...values) {
    return fn2(fn1(...values));
  }
}

/**
 * Mapper function for use with the map method
 * @param {number} x - The number to map
 * @returns {function} A function that multiplies its input by x
 */
export function mapper(x) { // map array item to close upon for later use
  return function multiply(y) { // Input from call site
    return x * y; // Leverages the closure variable x
  };
}

/**
 * Collapses a number using the mapping and reducing functions
 * @param {number} num - The number to collapse
 * @returns {number} The collapsed number
 */
export function collapse(num) {
  return (function composed(arg) {
    return [3, 17, 6, 4].map(mapper).reduce(function composer(fn1, fn2) {
      return fn2(fn1(arg));
    });
  }(num));
}

/**
 * Lazily composes functions from right to left
 * @param {...function} fns - The functions to compose
 * @returns {function} A function that is the composition of the input functions
 */
export function composeLegacy(...fns) {
  return fns.reduceRight(function composer(fn1, fn2) {
    return function composed(...args) {
      return fn2(fn1(...args));
    };
  });
}

/**
 * Composes functions from right to left
 * @param {...function} fns - The functions to compose
 * @returns {function} A function that is the composition of the input functions
 */
export function compose(...fns) {
  return function composed(...initialArgs) { // Exec fns backwards from right
    return fns.slice(0, -1).reduceRight(function composer(accumulator, fn) {
      return fn(accumulator); // subsequent fns are unary for task processing
    }, fns.at(-1)(...initialArgs)); // The 1st fn is veriadic for task loading
  };
}

/**
 * Pipes a value through a list of functions from left to right
 * @param {...function} fns - The functions to pipe through
 * @returns {function} A function that pipes its input through the given functions
 */
export function pipeLoop(...fns) {
  return function piped(result) {
    var list = [...fns];

    while (list.length > 0) { // Remove the first function from the left, execute  it
      result = list.shift()(result);
    }

    return result;
  };
}

/**
 * Pipes a value through a list of functions from right to left (lazy)
 * @param {...function} fns - The functions to pipe through
 * @returns {function} A function that pipes its input through the given functions
 */
export function pipeLazy(...fns) {
  return fns.reduce(function piper(fn1, fn2) { // f1 is the leftmost function
    return function piped(...args) {
      return fn2(fn1(...args));
    };
  });
}

/**
 * Pipes a value through a list of functions
 * @param {function} fn - The first function to call
 * @param {...function} fns - The functions to pipe through
 * @returns {function} A function that pipes its input through the given functions
 */
export function pipe(fn, ...fns) {
  return function piped(...initialArgs) {
    return fns.reduce(function piper(result, fn) {
      return fn(result); // subsequent fns are unary
    }, fn(...initialArgs)); // The first fn is veriadic
  };
}

/**
 * Binds a function to a specific context
 * @param {function} fn - The function to bind
 * @param {Object} thisObj - The context to bind to
 * @returns {function} A function that calls fn with thisObj as its context
 */
export function bind(fn, thisObj) {
  return function bound(...args) {
    return fn.apply(thisObj, args);
  };
}

/**
 * Applies a function to a specific context
 * @param {function} fn - The function to apply
 * @param {Object} thisObj - The context to apply to
 * @returns {function} A function that calls fn with thisObj as its context
 */
export function apply(fn, thisObj) {
  return function applied(...args) {
    return fn.call(thisObj, ...args);
  };
}

/**
 * Checks if a number is prime
 * @param {number} num - The number to check
 * @param {number} [divisor=2] - The divisor to check with
 * @returns {boolean} True if the number is prime, false otherwise
 */
export function isPrime(num, divisor = 2) {
  if (num < 2 || (num > 2 && num % divisor === 0)) {
    return false;
  }

  if (divisor <= Math.sqrt(num)) {
    return isPrime(num, divisor + 1);
  }

  return true;
}

/**
 * Calculates the Fibonacci number at a given position
 * @param {number} num - The position in the Fibonacci sequence
 * @returns {number} The Fibonacci number at the given position
 */
export function fibonacci(num) {
  if (num <= 1) {
    return num;
  }

  return fibonacci(num - 2) + fibonacci(num - 1);
}

/**
 * Checks if a number is even
 * @param {number} v - The number to check
 * @returns {boolean} True if the number is even, false otherwise
 */
export function isEven(v) {
  return v === 0 ? true : isOdd(Math.abs(v) - 1);
}

/**
 * Checks if a number is odd
 * @param {number} v - The number to check
 * @returns {boolean} True if the number is odd, false otherwise
 */
export function isOdd(v) {
  return v === 0 ? false : isEven(Math.abs(v) - 1);
}

/**
 * Skips words shorter than 5 characters
 * @param {string[]} words - The array of words to filter
 * @returns {string[]} A new array with words longer than 4 characters
 */
export function skipShortWords(words) {
  var filteredWords = [];

  for (const word of words) {
    if (word.length > 4) {
      filteredWords.push(word);
    }
  }
  return filteredWords;
}

/**
 * Skips words longer than 4 characters
 * @param {string[]} words - The array of words to filter
 * @returns {string[]} A new array with words 4 characters or shorter
 */
export function skipLongWords(words) {
  var shortWords = [];

  for (const word of words) {
    if (word.length <= 4) {
      shortWords.push(word);
    }
  }
  return shortWords;
}

/**
 * Partially applies a function's arguments from the right
 * @param {function} fn - The function to partially apply
 * @param {...any} extraArgs - The extra arguments to apply
 * @returns {function} A function that takes the remaining arguments
 */
export function partialRight(fn, ...extraArgs) {
  return function partiallyApplied(...mainArgs) {
    return fn(...mainArgs, ...extraArgs);
  };
}

/**
 * Partially applies a function's arguments
 * @param {function} fn - The function to partially apply
 * @param  {...any} presetArgs - The arguments to preset
 * @returns {function} A function that, when called, has its first arguments pre-filled
 */
export function partial(fn, ...presetArgs) {
  return function partiallyApplied(...laterArguments) {
    return fn(...presetArgs, ...laterArguments);
  };
}

/**
 * Partially applies an object's properties to a function
 * @param {function} fn - The function to partially apply to
 * @param {Object} presetArgsObj - The object with preset properties
 * @returns {function} A function that takes an object with additional properties
 */
export function partialProps(fn, presetArgsObj) {
  return function partiallyApplied(laterArgsObj) {
    return fn(Object.assign({}, presetArgsObj, laterArgsObj));
  };
}

/**
 * Returns a new array with unique values from the input list
 * @template T
 * @param {T[]} list - The array to filter
 * @returns {T[]} A new array with unique values
 */
export function unique(list) {
  var uniqueList = [];

  for (let v of list) {
    // value not yet in the new list
    if (uniqueList.indexOf(v) === -1) {
      uniqueList.push(v);
    }
  }
  return uniqueList;
}

/**
 * Curries a function with object properties
 * @param {function} fn - The function to curry
 * @param {number} [arity=1] - The number of arguments the function expects
 * @returns {function} A curried version of the input function
 */
export function curryProps(fn, arity = 1) {
  return (function nextCurried(prevArgsObj) {
    return function curry(nextArgObject = {}) {
      var [key] = Object.keys(nextArgObject);
      var allArgsObj = Object.assign({}, prevArgsObj, { [key]: nextArgObject[key] });

      if (Object.keys(allArgsObj).length >= arity) {
        return fn(allArgsObj);
      }
      return nextCurried(allArgsObj);
    };
  }({}));
}

/**
 * Curries a function
 * @param {function} fn - The function to curry
 * @param {number} [arity=fn.length] - The number of arguments the function expects
 * @returns {function} A curried version of the input function
 */
export function curry(fn, arity = fn.length) {
  return (function nextCurried(prevArgs) {
    return function curried(nextArg) {
      var args = [...prevArgs, nextArg];
      return args.length >= arity ? fn(...args) : nextCurried(args);
    };
  }([]));
}

/**
 * Restores a curried function to its original form
 * reverses the currying effect
 * @param {function} fn - The curried function
 * @returns {function} The uncurried version of the function
 */
export function uncurry(fn) {
  return function uncurried(...args) {
    var ret = fn;
    for (const arg of args) {
      ret = ret(arg);
    }
    return ret;
  }
}

/**
 * Sums a list of numbers
 * @param {...number} nums - The numbers to sum
 * @returns {number} The sum of the numbers
 */
export function sum(...nums) {
  return nums.reduce((num1, num2) => num1 + num2);
}

/**
 * Uncurries a curried function using reduce
 * @param {function} curriedFn - The curried function to uncurry
 * @returns {function} The uncurried version of the function
 */
export function uncurryX(curriedFn) {
  return function uncurried(...args) {
    return args.reduce(function uncurrier(curried, next) {
      return curried(next);
    }, curriedFn);
  };
}

/**
 * Creates a loosely curried version of a function
 * @param {function} fn - The function to curry
 * @param {number} [arity=fn.length] - The number of arguments the function expects
 * @returns {function} A curried version of the input function
 */
export function looseCurry(fn, arity = fn.length) {
  return (function nextCurried(prevArgs) {
    return function curried(...nextArgs) {
      var args = [...prevArgs, ...nextArgs];
      return args.length >= arity ? fn(...args) : nextCurried(args);
    };
  }([]));
}

/**
 * Reverses the order of arguments passed to a function
 * @param {function} fn - function to be reversed
 * @param  {...any} args - arguments to be reversed
 * @returns {function} a new function that, when called, has its arguments reversed
*/
export function reverseArgs(fn) {
  return function reversed(...args) {
    return fn(...(args.reverse()));
  };
}

/**
 * Force a function a function to accept only one arguments at most
 * @param {function} fn - The function to restrict
 * @returns {function} A function that accepts only one argument
 */
export function unary(fn) {
  return function onlyOneArg(arg) {
    return fn(arg);
  };
}

/**
 * Force a function a function to accept only two arguments at most
 * @param {function} fn - The function to restrict
 * @returns {function} A function that accepts only two arguments
 */
export function binary(fn) {
  return function onlyTwoArgs(arg1, arg2) {
    return fn(arg1, arg2);
  };
}

/**
 * Negate the predication result of an input
 * @param {function} predicate - The predicate function to negate
 * @returns {function} A function that returns the negated result
 */
export function not(predicate) {
  return function negated(...args) {
    return !predicate(...args);
  }
}

/**
 * Run a function when a criteria is met for a given input
 * @param {function} predicate - The predicate function to test the criteria
 * @param {function} fn - The function to run when the criteria is met
 * @returns {function} A function that runs fn if predicate returns true
 */
export function when(predicate, fn) {
  return function conditional(...args) {
    return predicate(...args) ? fn(...args) : undefined;
  }
}

/**
 * Spead an array input to a function as individual arguments
 * @param {function} fn - The function to spread arguments to
 * @returns {function} A function that spreads its array argument to fn
 */
export function spreadArgs(fn) {
  return function spread(argsArray) {
    return fn(...argsArray)
  };
}

/**
 * Customizes a function expecting multiple arguments inputs originally
 * to recieve just one single array input, which is a collection of all the args
 * @param {function} fn - The function to customize
 * @returns {function} A function that accepts a single array argument
 */
export function gatherArgs(fn) {
  return function gather(...argsArray) {
    return fn(argsArray);
  };
}

/**
 * Replaces circular references in an object with a placeholder string
 * @param {Object} obj - The object to process
 * @returns {Object} The processed object with circular references replaced
 */
export function deCycle(obj) {
  for (var p in obj)
    if (obj[p] && obj[p][p] && obj[p][p][p]) obj[p] = "[object Circles]";
  return obj;
}


/**
 * Collection of bound console methods
 * Each method is bound to the console object to maintain proper context
 * @type {Object.<string, Function>}
 */
const consoleExports = {};
for (const method of Object.keys(console))
  if (typeof console[method] === "function")
    consoleExports[method] = console[method].bind(console);

/**
 * Export commonly used console methods
 * Each method maintains its original console context through binding
 */
export const {
  assert, clear, count, countReset, debug, dir, dirxml, error, group,
  groupCollapsed, groupEnd, info, log, table, time, timeEnd, timeLog,
  timeStamp, trace, warn,
} = consoleExports;
