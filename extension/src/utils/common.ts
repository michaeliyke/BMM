import moment from "moment";
import { IBookmark } from "./types/schemas";


export function sortedBookmarks(bookmarks: IBookmark[]): IBookmark[] {
    // Deep copy the original data to avoid mutation
    const copy: IBookmark[] = JSON.parse(JSON.stringify(bookmarks));
    // Sort bookmarks in each category by updated_at
    copy.sort((a, b) => moment(b.updated_at).diff(moment(a.updated_at)));
    return copy;
}
