import { BookmarksDisplayProps } from "../../utils/types/props";
import BookmarkDetails from "./BookmarkDetails";
import ShowBookmarks from "./ShowBookmarks";

export default function ContentBody(props: BookmarksDisplayProps) {
    const {
        filteredCategories,
        bookmarkToShow,
        setBookmarkToShow,
        selectedTag,
        bookmarks,
        setBookmarks,
    } = props;

    const whatToShow = bookmarkToShow ?
        <BookmarkDetails
            filteredCategories={filteredCategories}
            bookmarkToShow={bookmarkToShow}
            setBookmarkToShow={setBookmarkToShow}
            bookmarks={bookmarks}
            setBookmarks={setBookmarks}
        /> :
        <ShowBookmarks
            filteredCategories={filteredCategories}
            bookmarkToShow={bookmarkToShow}
            setBookmarkToShow={setBookmarkToShow}
            selectedTag={selectedTag}
            bookmarks={bookmarks}
            setBookmarks={setBookmarks}
        />;
    return <>{whatToShow}</>;
}
