import {
    IBookmark,
    IBookmarkTag,
    ITag,
} from "../../utils/types/schemas";
import { Operator } from "../operator";
import { v4 as uuidv4 } from 'uuid';

export default {

    /**
     * Adds a tag to a bookmark and links it to a given category.
     *
     * @param tag - The tag to be added.
     * @param bookmarkId - The ID of the bookmark to which the tag will be linked.
     * @param categoryId - The ID of the category under which the bookmark exists.
     * @returns A promise that resolves when the tag has been successfully added and linked.
     *
     * @throws Will throw an error if the bookmark with the given ID is not found.
     * @throws Will throw an error if the bookmark does not exist under the given category.
     * @throws Will throw an error if the category with the given ID is not found.
     * @throws Will throw an error if the tag already exists under the given category.
     */
    async createBookmarkTag(tagId: string, bookmarkId: string): Promise<void> {
        // Ensure bookmark exists
        if (!(await Operator.getRecordByIndex<IBookmark>('bookmarks', 'bookmarks_index', bookmarkId)))
            throw new Error(`Bookmark with id ${bookmarkId} not found`);

        // Ensure tag exists
        if (!(await Operator.getRecordByIndex<ITag>('tags', 'tags_index', tagId)))
            throw new Error(`Tag with id ${tagId} not found`);

        const data = { tag_id: tagId, bookmark_id: bookmarkId, id: uuidv4() };
        await Operator.createRecord<IBookmarkTag>('bookmark_tags', data);
    },

    /**
     * Moves a tag from one bookmark to another.
     *
     * @param tagId - The ID of the tag to be moved.
     * @param fromBookmarkId - The ID of the bookmark from which the tag is to be moved.
     * @param toBookmarkId - The ID of the bookmark to which the tag is to be moved.
     * @returns A promise that resolves when the tag has been successfully moved.
     * @throws Will throw an error if the tag does not exist.
     * @throws Will throw an error if either the source or destination bookmark does not exist.
     * @throws Will throw an error if the tag does not exist under the source bookmark.
     */
    async moveBookmarkTag(tagId: string, fromBookmarkId: string, toBookmarkId: string): Promise<void> {
        // Move a tag from one bookmark to another

        // Ensure tag exists
        const tag = await Operator.getRecordByIndex<ITag>('tags', 'tags_index', tagId);
        if (!tag)
            throw new Error(`Tag with id ${tagId} not found`);

        // Ensure both bookmarks exists
        const fromBookmark = await Operator.getRecordByIndex<IBookmark>('bookmarks', 'bookmarks_index', fromBookmarkId);
        if (!fromBookmark)
            throw new Error(`Bookmark with id ${fromBookmarkId} not found`);

        const toBookmark = await Operator.getRecordByIndex<IBookmark>('bookmarks', 'bookmarks_index', toBookmarkId);
        if (!toBookmark)
            throw new Error(`Bookmark with id ${toBookmarkId} not found`);

        // Ensure tag exists under the fromBookmark
        const bookmarkTag = await Operator.getRecordByIndex<IBookmarkTag>("bookmark_tags", "bookmark_tags_index", [fromBookmarkId, tagId]);
        if (!bookmarkTag)
            throw new Error(`Tag with id ${tagId} not found under bookmark with id ${fromBookmarkId} `);

        const updated = { ...bookmarkTag, bookmark_id: toBookmarkId };
        await Operator.updateRecord<IBookmarkTag>('bookmark_tags', updated, bookmarkTag.id);
    },

    /**
     * Removes a tag from a bookmark.
     *
     * @param tagId - The ID of the tag to be removed.
     * @param bookmarkId - The ID of the bookmark from which the tag will be removed.
     * @returns A promise that resolves when the tag has been removed from the bookmark.
     * @throws Will throw an error if the tag does not exist.
     * @throws Will throw an error if the bookmark does not exist.
     * @throws Will throw an error if the tag is not associated with the bookmark.
     */
    async deleteBookmarkTag(tagId: string, bookmarkId: string): Promise<void> {
        // Remove a tag from a bookmark

        // Ensure tag exists
        if (!(await Operator.getRecordByIndex<ITag>('tags', 'tags_index', tagId)))
            throw new Error(`Tag with id ${tagId} not found`);

        // Ensure bookmark exists
        if (!(await Operator.getRecordByIndex<IBookmark>('bookmarks', 'bookmarks_index', bookmarkId)))
            throw new Error(`Bookmark with id ${bookmarkId} not found`);

        // Ensure tag exists under the bookmark
        const query = [bookmarkId, tagId];
        if (!(await Operator.getRecordByIndex<IBookmarkTag>('bookmark_tags', 'bookmark_tags_index', query)))
            throw new Error(`Tag with id ${tagId} not found under bookmark with id ${bookmarkId} `);

        // Delete the bookmark_tag reference
        await Operator.deleteRecordsByIndex("bookmark_tags", "bookmark_tags_index", query);
    },

};
