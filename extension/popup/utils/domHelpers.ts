

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
