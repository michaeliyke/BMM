
export function setDefaultCategoryText(categoryText: string) {
    const element = document.querySelector('.current-category');
    if (element) {
        element.textContent = categoryText;
    }
}

// Add a class to the target element if not already present
export function addClass(target: Element, classNames: string[]) {
    target.classList.add(...classNames);
}

// Remove a class from the target element
export function removeClass(target: Element, classNames: string[]) {
    target.classList.remove(...classNames);
}

// Check has class
export function hasClass(target: Element, className: string) {
    return target.classList.contains(className);
}

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
