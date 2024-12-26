import { Dispatch, SetStateAction } from "react";
import { ICategory } from "../../utils/types/schemas";

type SideBarHeaderProps = {
    categories: ICategory[];
    selectedCategory: ICategory | null;
    setSelectedCategory: Dispatch<SetStateAction<ICategory | null>>;
    defaultCategory: ICategory;
};


export default function SideBarHeader() {
    return (
        <header>
            <form>
                <select aria-label="Filter Options" name="filter-options">
                    <option value="categories" className="current">Categories</option>
                    <option value="filter:tags">Filter:Tags</option>
                    <option value="filter:category/tags">Filters:Category/Tags</option>
                </select>
            </form>
        </header>
    );
}
