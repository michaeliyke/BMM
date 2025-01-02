import { ChangeEvent } from "react";
import { SideBarProps } from "../../utils/types/props";

export default function SideBarHeader({ props }: SideBarProps) {
    const { filterBy, setFilterBy } = props;

    function handleFilterSelection(event: ChangeEvent<HTMLSelectElement>) {
        if (setFilterBy)
            setFilterBy(event.target.value);
    }

    return (
        <header>
            <form>
                <label htmlFor="filter-options">
                    <select
                        id="filter-options"
                        className="bg-gray-200"
                        aria-label="Filter by"
                        name="filter-options"
                        value={filterBy}
                        onChange={handleFilterSelection}
                    >
                        <option value="categories" className="current">Categories</option>
                        <option value="filter:tags">Filter:Tags</option>
                        <option value="filter:category/tags">Filters:Category/Tags</option>
                    </select>
                </label>
            </form>
        </header>
    );
}
