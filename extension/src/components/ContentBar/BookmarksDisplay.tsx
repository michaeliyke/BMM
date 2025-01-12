import { BookmarksDisplayProps } from "../../utils/types/props";
import BookmarkDetails from "./BookmarkDetails";
import ShowBookmarks from "./ShowBookmarks";

export default function ContentBody(props: BookmarksDisplayProps) {
    const {
        filteredCategories,
        bookmarkToShow,
        setBookmarkToShow,
        selectedTag,
    } = props;

    // We will show all bookmarks if:
    //  showAll is true
    //  bookmarkToShow is null
    // selectedCategory changes

    const whatToShow = bookmarkToShow ?
        <BookmarkDetails
            filteredCategories={filteredCategories}
            bookmarkToShow={bookmarkToShow}
            setBookmarkToShow={setBookmarkToShow}
        /> :
        <ShowBookmarks
            filteredCategories={filteredCategories}
            bookmarkToShow={bookmarkToShow}
            setBookmarkToShow={setBookmarkToShow}
            selectedTag={selectedTag}
        />;
    return <>{whatToShow}</>;
}
