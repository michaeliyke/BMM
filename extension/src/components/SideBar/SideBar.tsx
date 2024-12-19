import { addClass, removeClass, setDefaultCategoryText } from "../../utils/domHelpers";
import { ICategory } from "../../utils/types/schemas";
import { Dispatch, SetStateAction, useEffect } from "react";


type SideBarProps = {
    categories: ICategory[];
    updateCategory?: (category: ICategory) => void;
    selectedCategory: ICategory | null;
    setSelectedCategory: Dispatch<SetStateAction<ICategory | null>>;
    defaultCategory: ICategory;
};

// Remove class selected from all categories and add it target
function toggleSelectedClass(target: HTMLLIElement) {
    const categories = document.querySelectorAll('.category');
    categories.forEach((category) => {
        if (category.classList.contains('selected') && category !== target) {
            removeClass(category, 'selected');
        }
    });

    if (!target.classList.contains('selected')) {
        addClass(target, 'selected');
    }
}
// Remove class highlighted from all categories and add it target
function toggleHighlightedClass(target: HTMLLIElement) {
    const categories = document.querySelectorAll('.category');
    categories.forEach((category) => {
        if (category.classList.contains('highlighted') && category !== target) {
            removeClass(category, 'highlighted');
        }
    });

    if (!target.classList.contains('highlighted')) {
        addClass(target, 'highlighted');
    }
}

// Reset selected and highlighted categories, .all will be selected, and categories[0] will be highlighted
function resetSelections() {
    const categories = document.querySelectorAll('.category');
    categories.forEach((category) => {
        removeClass(category, 'selected');
        removeClass(category, 'highlighted');
    });
    addClass(categories[0], 'selected');
    addClass(categories[1], 'highlighted');
}


function sortedCategories(data: ICategory[]): ICategory[] {
    // Deep copy the original data to avoid mutation
    const copy: ICategory[] = JSON.parse(JSON.stringify(data));
    // Sort the categories alphabetically by name
    copy.sort((a, b) => a.name.localeCompare(b.name));

    // Push the defaultCategory to the front of the array
    const defaultCategoryIndex = copy.findIndex((cat) => cat.is_default === 1);
    // If found, remove it from its current index and push it to the front
    if (defaultCategoryIndex !== -1) {
        const removedCategory = copy.splice(defaultCategoryIndex, 1)[0];
        copy.unshift(removedCategory);
        return copy;
    }

    return copy;
}

export default function SideBar(props: SideBarProps) {
    const { defaultCategory } = props;
    const { categories, selectedCategory, setSelectedCategory } = props;

    useEffect(() => {
        // Set the default category text in the header
        setDefaultCategoryText(defaultCategory?.name);
    }, [defaultCategory]);


    function toggleSelected(event: React.MouseEvent<HTMLLIElement>) {
        const target = event.currentTarget;
        const category = categories.find((cat) => cat.name === target.textContent);
        if (category) {
            setSelectedCategory(category);
            // Update the category text in the header
            setDefaultCategoryText(category.name);
            toggleSelectedClass(target);
            toggleHighlightedClass(target);
        }
    }

    // Brings the selection and highlighting to the default state
    function restoreDefaultSection(e: React.MouseEvent<HTMLLIElement>) {
        const target = e.currentTarget;
        setSelectedCategory(null);
        // If the default category is already selected
        if (selectedCategory?.name === defaultCategory?.name) {
            addClass(target, 'selected');
            if (target.nextElementSibling)
                removeClass(target.nextElementSibling, 'selected');
            return
        }
        removeClass(target, 'selected');
        resetSelections();
        setDefaultCategoryText(defaultCategory?.name);
    }

    return (
        <article className="sidebar">
            <header>
                <form>
                    <select aria-label="Filter Options" name="filter-options">
                        <option value="categories"
                            className="current">Categories</option>
                        <option value="filter:tags">Filter:Tags</option>
                        <option value="filter:category/tags">Filter:Category/Tags</option>
                    </select>
                </form>
            </header>
            <section className="filtered-list">
                <ul className="categories">
                    <li
                        className="category all selected"
                        onClick={restoreDefaultSection}
                    ><span>All Categories</span></li>
                    {sortedCategories(categories).map((category, index) => (
                        <li key={index} className={category.is_default === 1 ? "category highlighted" : "category"}
                            onClick={toggleSelected}>
                            <span>{category.name}</span>
                        </li>
                    ))}
                </ul>
            </section>
            <footer>Sidebar Footer</footer>
        </article>
    )
}
