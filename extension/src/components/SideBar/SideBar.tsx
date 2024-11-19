import { TCategory } from "../../utils/types.payload";
import { useState } from "react";

type SideBarProps = {
    categories: TCategory[],
    updateCategory?: (category: TCategory) => void
};

// Remove class selected from all categories and add it target
function toggleSelectedClass(target: HTMLLIElement) {
    const categories = document.querySelectorAll('.category');
    categories.forEach((category) => {
        category.classList.remove('selected');
    });
    target.classList.add('selected');
}
// Remove class highlighted from all categories and add it target
function toggleHighlightedClass(target: HTMLLIElement) {
    const categories = document.querySelectorAll('.category');
    categories.forEach((category) => {
        category.classList.remove('highlighted');
    });
    target.classList.add('highlighted');
    const _curr = document.querySelector('.current-category');
    if (_curr) {
        _curr.textContent = target.textContent;
    }
}

// Reset selected and highlighted categories, .all will be selected, and categories[0] will be highlighted
function resetSelections() {
    const categories = document.querySelectorAll('.category');
    categories.forEach((category) => {
        category.classList.remove('selected');
        category.classList.remove('highlighted');
    });
    categories[0].classList.add('selected');
    categories[1].classList.add('highlighted');
    const _curr = document.querySelector('.current-category');
    if (_curr) {
        _curr.textContent = 'DEFAULT';
    }
}

export default function SideBar(props: SideBarProps) {
    const { categories } = props;
    const [selectedCategory, setSelectedCategory] = useState<TCategory | null>(null);
    const [highlightedCategory, setHighlightedCategory] = useState<TCategory | null>(null);

    function toggleSelected(event: React.MouseEvent<HTMLLIElement>) {
        const target = event.currentTarget;
        const category = categories.find((cat) => cat.name === target.textContent);
        if (category) {
            setSelectedCategory(category);
            setHighlightedCategory(category);
            toggleSelectedClass(target);
            toggleHighlightedClass(target);
        }
    }

    return (
        <article className="sidebar">
            <header>
                <section>
                    <select aria-label="Filter Options">
                        <option value="categories"
                            className="current">Categories</option>
                        <option value="filter:tags">Filter:Tags</option>
                        <option value="filter:category/tags">Filter:Category/Tags</option>
                    </select>
                </section>
            </header>
            <section className="filtered-list">
                <ul className="categories">
                    {selectedCategory ? (
                        <li className="category all" onClick={() => {
                            setSelectedCategory(null);
                            setHighlightedCategory(null);
                            resetSelections();
                        }}><span>All Categories</span></li>
                    ) : (
                        <li className="category all selected"><span>All Categories</span></li>
                    )}
                    {categories.map((category, index) => (
                        index === 0 && !highlightedCategory ? (
                            <li key={index} className="category highlighted" onClick={toggleSelected}>
                                <span>{category.name}</span>
                            </li>) : (
                            <li key={index} className="category" onClick={toggleSelected}>
                                <span>{category.name}</span>
                            </li>
                        )
                    ))}
                </ul>
            </section>
            <footer>Sidebar Footer</footer>
        </article>
    )
}
