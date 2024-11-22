
export function setDefaultCategoryText(categoryText: string) {
    const element = document.querySelector('.current-category');
    if (element) {
        element.textContent = categoryText;
    }
}

// Add a class to the target element if not already present
export function addClass(target: Element, classToAdd: string) {
    if (!target.className.includes(classToAdd)) {
        target.className += ` ${classToAdd}`;
    }
}

// Remove a class from the target element
export function removeClass(target: Element, classToRemove: string) {
    const classNames = target.className.split(' ');
    const filtered = classNames.filter((name) => name !== classToRemove);
    target.className = filtered.join(' ');
}
