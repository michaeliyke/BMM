// Takes one argument and does nothing but return the value untouched
export function identity(value) {
  return value;
}

// Trampolines
// Instead of functions calling functions, the stack never goes beyond depth of one,
// because each function just returns the next function that should be called. A loop
// simply keeps running each returned function until there are no more functions to
// run.
// One advantage with trampolines is you aren’t limited to environments that support
// PTC; another is that each function call is regular, not PTC optimized, so it may run
// quicker.
export function trampoline(fn) {
  return function trampolined(...args) {
    var result = fn(...args);

    while (typeof result === "function") {
      result = result();
    }

    return result;
  };
}

export function uppercaseLetter(c) {
  var code = c.charCodeAt(0);

  if (code >= 97 && code <= 122) {
    code = code - 32;
  }

  return String.fromCharCode(code);
}

export function filter(predicate, arr) {
  var newList = [];

  for (let [index, value] of arr.entries()) {
    if (predicate(value, index, arr)) {
      newList.push(value);
    }

    return newList;
  }
}

export function filterReduce(predicate, items) {
  return items.reduce(function filterer(result, next) {
    return predicate(next) ? result.concat(next) : result;
  }, []);
}

export function map(mapper, items) {
  let newList = [];
  for (let [index, value] of items.entries()) {
    newList.push(mapper(value, index, items));
  }
  return newList;
}

// Alias
export function filterIn(predicate, arr) {
  return filter(predicate, arr);
}

export function filterOut(predicate, arr) {
  return filter(not(predicate), arr);
}

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

export function maxEven(num1, ...restNums) {
  var maxRest = restNums.length > 0 ? maxEven(...restNums) : undefined;

  return (num1 % 2 !== 0 || num1 < maxRest) ? maxRest : num1;
}

export function depth(node) {
  if (node) {
    let depthLeft = depth(node.left);
    let depthRight = depth(node.right);

    return 1 + max(depthLeft, depthRight);
  }

  return 0;
}

// Compound fibonacci recursion part A
export function fibCompositeA(n) {
  return n === 1 ? 1 : fibCompositeB(n - 2);
}

// Compount fibonacci recursion part B
export function fibCompositeB(n) {
  return n === 0 ? 0 : fibCompositeB(n - 1) + fibCompositeA(n);
}

// PTC compliant
// Continuation Passing Style (CPS)
export function fib(n, cont = identity) {
  if (n <= 1) return cont(n);
  return fib(n - 2, (n2) => fib(n - 1, (n1) => cont(n2 + n1)));
}

// First function takes single argument
export function composeLoop(...fns) {
  return function composed(result) {
    var list = [...fns];
    while (list.length > 0) {
      result = list.pop()(result);
    }
    return result;
  };
}

// First function takes single argument
export function composeNonLazy(...fns) {
  return function composed(result) {
    return fns.reduceRight(function composer(result, fn) {
      return fn(result);
    }, result);
  };
}

// compose function using recursion
// The first function accepts multiple arguments
export function composeRecursive(...fns) {
  var [fn1, fn2, ...rest] = fns.reverse(); // pull off the last two arguments
  var composedFn = function composed(...args) {
    return fn2(fn1(...args));
  };
  return rest.length === 0 ? composedFn : compose(...rest.reverse(), composedFn);
}

// To be used by the reduce array method (array of functions)
export function reducer(fn1, fn2) { // Two reduce functions
  // must return a function as result so fn1 continues to be a function
  return function reduced(arg) {
    return fn2(fn1(arg));
  };
}

// Reduction composer function: sort to be used as input to reduce()
export function composer(fn1, fn2) { // Two reduce functions
  // must return a function as result so fn1 continues to be a function
  return function composed(...values) {
    return fn2(fn1(...values));
  }
}

//Special: To be used by the map array method
// var arr = [3, 17, 6, 4].map(mapper);
// var fn = arr.reduce(reducer);
// fn(9); (11016 (9*3*17*6*4)); fn(10) (12240 (10*9*17*6*4))
export function mapper(x) { // map array item to close upon for later use
  return function multiply(y) { // Input from call site
    return x * y; // Leverages the closure variable x
  };
}

// Special - just to demo above
export function collapse(num) {
  return (function composed(arg) {
    return [3, 17, 6, 4].map(mapper).reduce(function composer(fn1, fn2) {
      return fn2(fn1(arg));
    });
  }(num));
}

// Lazy evaluated by default. Checkout composeNonLazy()
export function composeLegacy(...fns) {
  return fns.reduceRight(function composer(fn1, fn2) {
    return function composed(...args) {
      return fn2(fn1(...args));
    };
  });
}

export function compose(...fns) {
  return function composed(...initialArgs) { // Exec fns backwards from right
    return fns.slice(0, -1).reduceRight(function composer(accumulator, fn) {
      return fn(accumulator); // subsequent fns are unary for task processing
    }, fns.at(-1)(...initialArgs)); // The 1st fn is veriadic for task loading
  };
}

// First function takes single argument
export function pipeLoop(...fns) {
  return function piped(result) {
    var list = [...fns];

    while (list.length > 0) { // Remove the first function from the left, execute  it
      result = list.shift()(result);
    }

    return result;
  };
}

// First function takes multiple argument
export function pipeLazy(...fns) {
  return fns.reduce(function piper(fn1, fn2) { // f1 is the leftmost function
    return function piped(...args) {
      return fn2(fn1(...args));
    };
  });
}

export function pipe(fn, ...fns) {
  return function piped(...initialArgs) {
    return fns.reduce(function piper(result, fn) {
      return fn(result); // subsequent fns are unary
    }, fn(...initialArgs)); // The first fn is veriadic
  };
}

export function bind(fn, thisObj) {
  return function bound(...args) {
    return fn.apply(thisObj, args);
  };
}

export function apply(fn, thisObj) {
  return function applied(...args) {
    return fn.call(thisObj, ...args);
  };
}

export function isPrime(num, divisor = 2) {
  if (num < 2 || (num > 2 && num % divisor === 0)) {
    return false;
  }

  if (divisor <= Math.sqrt(num)) {
    return isPrime(num, divisor + 1);
  }

  return true;
}

export function fibonacci(num) {
  if (num <= 1) {
    return num;
  }

  return fibonacci(num - 2) + fibonacci(num - 1);
}

// mutual recursion
export function isEven(v) {
  return v === 0 ? true : isOdd(Math.abs(v) - 1);
}

export function isOdd(v) {
  return v === 0 ? false : isEven(Math.abs(v) - 1);
}


export function skipShortWords(words) {
  var filteredWords = [];

  for (const word of words) {
    if (word.length > 4) {
      filteredWords.push(word);
    }
  }
  return filteredWords;
}

export function skipLongWords(words) {
  var shortWords = [];

  for (const word of words) {
    if (word.length <= 4) {
      shortWords.push(word);
    }
  }
  return shortWords;
}

// Pre-fill a function with arguments to the right of the ones from call site
export function partialRight(fn, ...extraArgs) {
  return function partiallyApplied(...mainArgs) {
    return fn(...mainArgs, ...extraArgs);
  };
}

/**
 * This function presets a function with args. Later ones are additional
 * @param {function} fn function to be partially applied
 * @param  {...any} presetArgs arguments to be preset
 * @returns {function} a new function that, when called, has its first arguments pre-filled
 */
export function partial(fn, ...presetArgs) {
  return function partiallyApplied(...laterArguments) {
    return fn(...presetArgs, ...laterArguments);
  };
}

// creates a prefilled object that is open to customization
export function partialProps(fn, presetArgsObj) {
  return function partiallyApplied(laterArgsObj) {
    return fn(Object.assign({}, presetArgsObj, laterArgsObj));
  };
}

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

export function curry(fn, arity = fn.length) {
  return (function nextCurried(prevArgs) {
    return function curried(nextArg) {
      var args = [...prevArgs, nextArg];
      return args.length >= arity ? fn(...args) : nextCurried(args);
    };
  }([]));
}

// Restore a curried function to its original form
// reverses the currying effect
export function uncurry(fn) {
  return function uncurried(...args) {
    var ret = fn;
    for (const arg of args) {
      ret = ret(arg);
    }
    return ret;
  }
}

export function sum(...nums) {
  return nums.reduce((num1, num2) => num1 + num2);
}

export function uncurryX(curriedFn) {
  return function uncurried(...args) {
    return args.reduce(function uncurrier(curried, next) {
      return curried(next);
    }, curriedFn);
  };
}

export function looseCurry(fn, arity = fn.length) {
  return (function nextCurried(prevArgs) {
    return function curried(...nextArgs) {
      var args = [...prevArgs, ...nextArgs];
      return args.length >= arity ? fn(...args) : nextCurried(args);
    };
  }([]));
}

/**
 * This function reverses the order of arguments passed to a function
 * @param {function} fn function to be reversed
 * @param  {...any} args arguments to be reversed
 * @returns {function} a new function that, when called, has its arguments reversed
*/
export function reverseArgs(fn) {
  return function reversed(...args) {
    return fn(...(args.reverse()));
  };
}

// Force a function a function to accept only one arguments at most
export function unary(fn) {
  return function onlyOneArg(arg) {
    return fn(arg);
  };
}

// Force a function a function to accept only two arguments at most
export function binary(fn) {
  return function onlyTwoArgs(arg1, arg2) {
    return fn(arg1, arg2);
  };
}

// Negate the predication result of an input
export function not(predicate) {
  return function negated(...args) {
    return !predicate(...args);
  }
}

// Run a function when a criteria is met for a given input
export function when(predicate, fn) {
  return function conditional(...args) {
    return predicate(...args) ? fn(...args) : undefined;
  }
}

// Spead an array input to a function as individual arguments
export function spreadArgs(fn) {
  return function spread(argsArray) {
    return fn(...argsArray)
  };
}

// Customizes a function expecting multiple arguments inputs originally
// to recieve just one single array input, which is a collection of all the args
export function gatherArgs(fn) {
  return function gather(...argsArray) {
    return fn(argsArray);
  };
}

export function deCycle(obj) {
  for (var p in obj)
    if (obj[p] && obj[p][p] && obj[p][p][p]) obj[p] = "[object Circles]";
  return obj;
}

export const log = console.log.bind(console);

export const error = console.error.bind(console);

