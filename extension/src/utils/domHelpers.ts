
/**
 * Sets the text content of the element with the class 'current-category' to the provided category text.
 *
 * @param categoryText - The text to set as the content of the element with the class 'current-category'.
 */
export function setDefaultCategoryText(categoryText: string) {
    const element = document.querySelector('.current-category');
    if (element) {
        element.textContent = categoryText;
    }
}

/**
 * Adds one or more class names to the specified target element.
 *
 * @param target - The DOM element to which the class names will be added.
 * @param classNames - An array of class names to add to the target element.
 */
export function addClass(target: Element, classNames: string[]) {
    target.classList.add(...classNames);
}

/**
 * Removes one or more class names from the specified target element.
 *
 * @param target - The DOM element from which the class names will be removed.
 * @param classNames - An array of class names to be removed from the target element.
 */
export function removeClass(target: Element, classNames: string[]) {
    target.classList.remove(...classNames);
}

/**
 * Checks if the target element has the specified class.
 *
 * @param target - The DOM element to check.
 * @param className - The class name to look for.
 * @returns `true` if the target element has the specified class, otherwise `false`.
 */
export function hasClass(target: Element, className: string) {
    return target.classList.contains(className);
}

/**
 * Retrieves the name of a provided function or the nearest named caller from the stack trace.
 *
 * @param func - The function whose name is to be retrieved.
 * @returns The name of the provided function if it has one and is not in the skip list,
 *          otherwise the name of the nearest named caller from the stack trace that is not in the skip list.
 *          If no valid name is found, returns "Top".
 */
export function getFuncName1(func: CallableFunction): string {
    const skipNames = ['Anonymous', 'async', 'RetryManager.withRetries'];
    const error = new Error();
    const stackLines = error.stack?.split("\n") || [];

    // Find the name of the provided function if it has one and it's not in the skip list
    if (func.name && !skipNames.includes(func.name)) {
        return func.name;
    }

    console.log(stackLines);

    // Parse the stack trace to find the nearest named caller that isn't in the skip list
    for (let i = 2; i < stackLines.length; i++) { // Start at index 2 to skip this function and the immediate caller
        const match = stackLines[i].match(/at (\S+)/); // Extract the function name from the stack line
        if (match) {
            const callerName = match[0];
            if (!skipNames.includes(callerName) && callerName !== 'Object.<anonymous>') {
                return callerName; // Return the first valid named function not in the skip list
            }
        }
    }
    return "Top";
}

/**
 * Retrieves the name of the function that called `getFuncName`.
 *
 * This function throws and catches an error to access the stack trace,
 * then parses the stack trace to extract the name of the function that
 * called `getFuncName`.
 *
 * @returns {string | null} The name of the calling function, or `null` if the name cannot be determined.
 */
export function getFuncName() {
    try {
        throw new Error();
    } catch (err) {
        if (err instanceof Error && err.stack) {
            const stackLines = err.stack.split("\n").map((line) => line.trim());
            // Get the 3rd index (4th line, as 0-based index) of the stack trace
            if (stackLines.length > 3) {
                const match = stackLines[3].match(/at (.+?) \(/); // Extract name before '('
                if (match && match[1]) {
                    return match[1]; // Return the extracted function name
                }
            }
        }
    }
    return null; // Return null if no suitable name is found
}
