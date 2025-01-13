
import { useEffect } from "react";
import { ContentBarProps } from "../../utils/types/props";
import ContentBody from "./BookmarksDisplay";
import ContentHeader from "./ContentHeader";
import { getBookmarks } from "../../utils/common";

export default function ContentBar(props: ContentBarProps) {
    const {
        data,
        selectedCategory,
        bookmarkToShow,
        setBookmarkToShow,
        selectedTag,
        bookmarks,
        setBookmarks,
        setFilteredCategories,
        filteredCategories
    } = props;

    const sel = selectedCategory;

    useEffect(() => {
        /* CAUTION: the calls below is likely to cause infinite rendering */
        const x = sel ? data.filter((cat) => cat.id === sel.id) : data;
        setFilteredCategories(x);
        setBookmarks(getBookmarks(x));
    }, [selectedCategory, data, sel, setFilteredCategories, setBookmarks]);

    // console.log("Filtered Categories: ", data, filteredCategories);
    // console.log("Filtered Bookmarks: ", data, bookmarks);

    return (
        <article className="content mt-0">
            <ContentHeader
                selectedCategory={selectedCategory}
                filteredCategories={filteredCategories}
                bookmarkToShow={bookmarkToShow}
                setBookmarkToShow={setBookmarkToShow}
                setFilteredCategories={setFilteredCategories}
                bookmarks={bookmarks}
                setBookmarks={setBookmarks}
            />

            <ContentBody
                filteredCategories={filteredCategories}
                bookmarkToShow={bookmarkToShow}
                setBookmarkToShow={setBookmarkToShow}
                selectedTag={selectedTag}
                bookmarks={bookmarks}
                setBookmarks={setBookmarks}
            />
            <footer className="p-4 bg-gray-100 border-t border-gray-200">Content Footer</footer>
        </article>
    );
}
