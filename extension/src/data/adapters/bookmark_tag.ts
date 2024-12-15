import { LockManager } from "../../utils/locker";
import {
    IBookmark,
    IBookmarkTag,
    ITag,
} from "../../utils/types/schemas";
import { Operator } from "../operator";
import Bookmark from "./bookmark";
import Tag from "./tag";

const lockManager = new LockManager();

export default class BookmarkTag implements IBookmarkTag {
    id: string;
    bookmark_id: string;
    tag_id: string;

    constructor(bookmarkTag: IBookmarkTag) {
        this.id = bookmarkTag.id;
        this.bookmark_id = bookmarkTag.bookmark_id;
        this.tag_id = bookmarkTag.tag_id;
    }

    async exists(): Promise<boolean> {
        const callerName = new Error().stack?.split('\n')[2].trim().split(' ')[1];
        const query = [this.bookmark_id, this.tag_id];
        return lockManager.acquire(`${callerName}:${query}`, async () => {
            try {
                if (!await Operator.getRecordByIndex<IBookmarkTag>('bookmark_tags', 'bookmark_tags_index', query))
                    return true;
            } catch (error) {
                throw new Error(`An error occurred in BookmarkTag.exists:- ${error}, ${this}`);
            }
            return false;
        });
    }
    static async bookmarkTagExists(bookmarkId: string, tagId: string): Promise<boolean> {
        const callerName = new Error().stack?.split('\n')[2].trim().split(' ')[1];
        const query = [bookmarkId, tagId];
        return lockManager.acquire(`${callerName}:${query}`, async () => {
            try {
                if (!await Operator.getRecordByIndex<IBookmarkTag>('bookmark_tags', 'bookmark_tags_index', query))
                    return true;
            } catch (error) {
                throw new Error(`An error occurred in BookmarkTag.exists:- ${error}, ${query}`);
            }
            return false;
        });
    }

    /**
     * Adds a tag to a bookmark and links it to a given category.
     *
     * @returns A promise that resolves when the tag has been successfully added and linked.
     *
     * @throws Will throw an error if the bookmark with the given ID is not found.
     * @throws Will throw an error if the bookmark does not exist under the given category.
     * @throws Will throw an error if the category with the given ID is not found.
     * @throws Will throw an error if the tag already exists under the given category.
     */
    async create(): Promise<void> {
        const query = [this.bookmark_id, this.tag_id];
        lockManager.acquire(`BookmarkTag.create:${query}`, async () => {
            // Ensure bookmark exists
            try {
                if (!(await Bookmark.bookmarkExists(this.bookmark_id)))
                    throw new Error(`BookmakrTag.create:- Bookmark not found: ${this}`);

                // Ensure tag exists
                if (!(await Tag.tagExists(this.tag_id)))
                    throw new Error(`BookmakrTag.create:- Tag not found: ${this}`);

                // Ensure tag does not already exist under the bookmark
                if (!(await this.exists()))
                    await Operator.createRecord<IBookmarkTag>('bookmark_tags', this);
            } catch (error) {
                throw new Error(`An error occurred in BookmarkTag.create:- ${error}, ${this}`);
            }
        });
    }

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
    static async moveBookmarkTag(tagId: string, fromBookmarkId: string, toBookmarkId: string): Promise<void> {
        lockManager.acquire(tagId, async () => {
            // Move a tag from one bookmark to another

            // Ensure tag exists
            try {
                if (!(await Operator.getRecordByIndex<ITag>('tags', 'tags_index', tagId)))
                    throw new Error(`BookmarkTag.moveBookmarkTag:- Tag not found: ${this}`);

                // Ensure both bookmarks exists
                const fromBookmark = await Operator.getRecordByIndex<IBookmark>('bookmarks', 'bookmarks_index', fromBookmarkId);
                if (!fromBookmark)
                    throw new Error(`BookmarkTag.moveBookmarkTag:- fromBookmark  not found (${fromBookmarkId}): ${this}`);

                const toBookmark = await Operator.getRecordByIndex<IBookmark>('bookmarks', 'bookmarks_index', toBookmarkId);
                if (!toBookmark)
                    throw new Error(`BookmarkTag.moveBookmarkTag:- toBookmark not found (${toBookmarkId}): ${this}`);

                // Ensure tag exists under the fromBookmark
                const bookmarkTag = await Operator.getRecordByIndex<IBookmarkTag>("bookmark_tags", "bookmark_tags_index", [fromBookmarkId, tagId]);
                if (!bookmarkTag)
                    throw new Error(`BookmarkTag.moveBookmarkTag:- Tag (${tagId}) not found under fromBookmark (${fromBookmarkId}): ${this}`);

                const updated = { ...bookmarkTag, bookmark_id: toBookmarkId };
                await Operator.updateRecord<IBookmarkTag>('bookmark_tags', updated, bookmarkTag.id);
            } catch (error) {
                throw new Error(`An error occurred in BookmarkTag.moveBookmarkTag:- ${error}, ${this}`);
            }
        });
    }

    /**
     * Removes a tag from a bookmark.
     *
     * @returns A promise that resolves when the tag has been removed from the bookmark.
     * @throws Will throw an error if the tag does not exist.
     * @throws Will throw an error if the bookmark does not exist.
     * @throws Will throw an error if the tag is not associated with the bookmark.
     */
    async delete(): Promise<void> {
        lockManager.acquire(this.tag_id, async () => {
            // Ensure tag exists
            try {
                if (!(await Operator.getRecordByIndex<ITag>('tags', 'tags_index', this.tag_id)))
                    throw new Error(`BookmarkTag.delete:- Tag not found: ${this}`);

                // Ensure bookmark exists
                if (!(await Operator.getRecordByIndex<IBookmark>('bookmarks', 'bookmarks_index', this.bookmark_id)))
                    throw new Error(`BookmarkTag.delete:- Bookmark not found: ${this}`);

                // Ensure tag exists under the bookmark
                const query = [this.bookmark_id, this.tag_id];
                if (!(await Operator.getRecordByIndex<IBookmarkTag>('bookmark_tags', 'bookmark_tags_index', query)))
                    throw new Error(`BookmarkTag.delete:- BookmarkTag not found (${query}): ${this})`);

                // Delete the bookmark_tag reference
                await Operator.deleteRecordsByIndex("bookmark_tags", "bookmark_tags_index", query);
            } catch (error) {
                throw new Error(`An error occurred in BookmarkTag.delete:- ${error}, ${this}`);
            }
        });
    }

}
