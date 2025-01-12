
import { useState } from "react";
import { ContentBarProps } from "../../utils/types/props";
import { ICategory } from "../../utils/types/schemas";
import ContentBody from "./BookmarksDisplay";
import ContentHeader from "./ContentHeader";

export default function ContentBar(props: ContentBarProps) {
    const {
        data,
        selectedCategory,
        bookmarkToShow,
        setBookmarkToShow,
        selectedTag,
    } = props;

    const categoryFilterResults = selectedCategory
        ? data.filter((cat) => cat.id === selectedCategory.id)
        : data;
    const [filteredCategories, setFilteredCategories] = useState<ICategory[]>(categoryFilterResults);

    return (
        <article className="content mt-0">
            <ContentHeader
                selectedCategory={selectedCategory}
                filteredCategories={filteredCategories}
                bookmarkToShow={bookmarkToShow}
                setBookmarkToShow={setBookmarkToShow}
                setFilteredCategories={setFilteredCategories}
            />

            <ContentBody
                filteredCategories={filteredCategories}
                bookmarkToShow={bookmarkToShow}
                setBookmarkToShow={setBookmarkToShow}
                selectedTag={selectedTag}
            />
            <footer className="p-4 bg-gray-100 border-t border-gray-200">Content Footer</footer>
        </article>
    );
}
