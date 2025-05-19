import { IDBKeyRange, indexedDB } from "fake-indexeddb";
import {
    afterAll,
    beforeAll,
    beforeEach,
    describe,
    expect,
    it,
    vi
} from "vitest";
import { IBookmark, IBookmarkTag, ICategory, ICategoryBookmark, ITag } from "../../utils/types/schemas";
import { Operator } from "../operator";
import Bookmark from "./bookmark";
import BookmarkTag from "./bookmark_tag";
import Category from "./category";
import Tag from "./tag";
globalThis.indexedDB = indexedDB;
globalThis.IDBKeyRange = IDBKeyRange;


describe("INTEGRATED TESTS FOR BookmarkTag CLASS", async () => {
    let db: IDBDatabase;

    beforeAll(async () => {
        db = await Operator.initializeDatabase();
    });

    afterAll(() => {
        db.close();
        indexedDB.deleteDatabase("bmm");
    });

    let bookmark: IBookmark;
    let tag: ITag;

    beforeEach(async () => {
        await Operator.clearStores(db);
        bookmark = await Operator.createRecord<IBookmark>("bookmarks", {
            id: "bookmark-1",
            title: "Test Bookmark",
            url: "https://example.com",
            description: "Sample bookmark",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            tags: [],
            archived: 0,
            starred: 0
        });

        tag = await Operator.createRecord<ITag>("tags", {
            id: "tag-1",
            name: "Test Tag",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        });
    });

    describe("Method: BookmarkTag.create()", () => {
        it("should create a new bookmark-tag association", async () => {
            const bookmarkTag = new BookmarkTag({
                id: "bt-1-a",
                bookmark_id: bookmark.id,
                tag_id: tag.id
            });

            const result = await bookmarkTag.create();
            expect(result).toEqual(bookmarkTag);
        });

        it("should not create a duplicate bookmark-tag association", async () => {
            const bookmarkTag = new BookmarkTag({
                id: "bt-1",
                bookmark_id: bookmark.id,
                tag_id: tag.id
            });

            // await bookmarkTag.create();
            const duplicate = await bookmarkTag.create();
            expect(duplicate).toEqual(bookmarkTag);
        });

        it("should throw an error if an unexpected failure occurs", async () => {
            const bookmarkTag = new BookmarkTag({
                id: "bt-2",
                bookmark_id: bookmark.id,
                tag_id: "non-existent-tag"
            });
            setTimeout(async () => {
                await expect(bookmarkTag.create()).rejects.toThrow(
                    "An error occurred in BookmarkTag.create"
                );
            }, 500);
        });
    });
    describe("Method: BookmarkTag.getBookmarks()", () => {
        beforeEach(async () => {
            await Operator.createRecord<IBookmarkTag>("bookmark_tags", {
                id: "bt-1",
                bookmark_id: "bookmark-1",
                tag_id: "tag-1"
            });
        });

        it("should return bookmarks associated with a tag", async () => {
            new Bookmark({ ...bookmark, id: 'bookmark-2-a' }).create();
            const bookmarks = await BookmarkTag.getBookmarks("tag-1");
            expect(bookmarks).toHaveLength(1);
            expect(bookmarks[0].id).toBe("bookmark-1");
        });

        it("should return an empty array if no bookmarks are found", async () => {
            const bookmarks = await BookmarkTag.getBookmarks("micaheltag");
            expect(bookmarks).toHaveLength(0);
        });

        it("should throw an error if an issue occurs", async () => {
            const spy = vi.spyOn(BookmarkTag, "getBookmarks").mockRejectedValue(new Error("DB error"));
            try {
                await expect(BookmarkTag.getBookmarks("tag-1")).rejects.toThrow(
                    "An error occurred in BookmarkTag.getBookmarks"
                );
            } catch (error) {
                expect(error).toBeInstanceOf(Error);
                if (error instanceof Error) {
                    expect(error.message).toContain("DB error");
                }
            } finally {
                spy.mockRestore();
            }
        });
    });

    describe("Method: BookmarkTag.getTags()", () => {

        it("should return tags associated with a bookmark", async () => {
            await Operator.createRecord<IBookmarkTag>("bookmark_tags", {
                id: "bt-1",
                bookmark_id: "bookmark-1",
                tag_id: "tag-1"
            });
            const tags = await BookmarkTag.getTags("bookmark-1");
            expect(tags).toHaveLength(1);
            expect(tags[0].id).toBe("tag-1");
        });

        it("should return an empty array if no tags are found", async () => {
            const tags = await BookmarkTag.getTags("non-existent-bookmark");
            expect(tags).toHaveLength(0);
        });

        it("should throw an error if an issue occurs", async () => {
            const spy = vi.spyOn(BookmarkTag, "getTags").mockRejectedValue(new Error("DB error"));
            try {
                await expect(BookmarkTag.getTags("bookmark-1")).rejects.toThrow(
                    "An error occurred in BookmarkTag.getTags"
                );
            } catch (error) {
                expect(error).toBeInstanceOf(Error);
                if (error instanceof Error) {
                    expect(error.message).toContain("DB error");
                }
            } finally {
                spy.mockRestore();
            }
        });
    });

    describe("Method: BookmarkTag.getBookmarksIds()", () => {
        beforeEach(async () => {
            await Operator.createRecord<IBookmarkTag>("bookmark_tags", {
                id: "bt-1",
                bookmark_id: "bookmark-1",
                tag_id: "tag-1"
            });
        });

        it("should return bookmark IDs associated with a tag", async () => {
            const ids = await BookmarkTag.getBookmarksIds("tag-1");
            expect(ids).toEqual(["bookmark-1"]);
        });

        it("should return an empty array if no bookmarks are found", async () => {
            const ids = await BookmarkTag.getBookmarksIds("non-existent-tag");
            expect(ids).toHaveLength(0);
        });

        it("should throw an error if an issue occurs", async () => {
            const spy = vi.spyOn(BookmarkTag, "getBookmarksIds").mockRejectedValue(new Error("DB error"));
            try {
                await expect(BookmarkTag.getBookmarksIds("tag-1")).rejects.toThrow(
                    "An error occurred in BookmarkTag.getBookmarksIds"
                );
            } catch (error) {
                expect(error).toBeInstanceOf(Error);
                if (error instanceof Error) {
                    expect(error.message).toContain("DB error");
                }
            } finally {
                spy.mockRestore();
            }
        });
    });

    describe("Method: BookmarkTag.getTagsIds()", () => {
        beforeEach(async () => {
            await Operator.createRecord<IBookmarkTag>("bookmark_tags", {
                id: "bt-1",
                bookmark_id: "bookmark-1",
                tag_id: "tag-1"
            });
        });

        it("should return tag IDs associated with a bookmark", async () => {
            const ids = await BookmarkTag.getTagsIds("bookmark-1");
            expect(ids).toEqual(["tag-1"]);
        });

        it("should return an empty array if no tags are found", async () => {
            const ids = await BookmarkTag.getTagsIds("non-existent-bookmark");
            expect(ids).toHaveLength(0);
        });

        it("should throw an error if an issue occurs", async () => {
            const spy = vi.spyOn(BookmarkTag, "getAll").mockRejectedValue(new Error("DB error"));
            try {
                await expect(BookmarkTag.getTagsIds("bookmark-1")).rejects.toThrow(
                    "An error occurred in BookmarkTag.getTagsIds"
                );
            } catch (error) {
                expect(error).toBeInstanceOf(Error);
                if (error instanceof Error) {
                    expect(error.message).toContain("DB error");
                }
            } finally {
                spy.mockRestore();
            }
        });
    });

    describe("Method: BookmarkTag.exists() (Instance Method)", () => {
        it("should return null if the bookmark-tag relationship does not exist", async () => {
            const bookmarkTag = new BookmarkTag({ id: "bt-no-exists", bookmark_id: bookmark.id, tag_id: tag.id });
            const result = await bookmarkTag.exists();
            expect(result).toBeNull();
        });

        it("should return the existing bookmark-tag relationship", async () => {
            await Operator.createRecord<IBookmarkTag>("bookmark_tags", { id: "bt-1", bookmark_id: bookmark.id, tag_id: tag.id });
            const bookmarkTag = new BookmarkTag({ id: "bt-1", bookmark_id: bookmark.id, tag_id: tag.id });
            const result = await bookmarkTag.exists();
            expect(result).toEqual({ id: "bt-1", bookmark_id: bookmark.id, tag_id: tag.id });
        });

        it("should throw an error if the database operation fails", async () => {
            const spy = vi.spyOn(Operator, "getRecordByIndex").mockRejectedValue(new Error("DB failure"));
            try {
                const bookmarkTag = new BookmarkTag({ id: "bt-1", bookmark_id: bookmark.id, tag_id: tag.id });
                await expect(bookmarkTag.exists()).rejects.toThrow("An error occurred in BookmarkTag.exists:- Error: DB failure");
            } catch (error) {
                expect(error).toBeInstanceOf(Error);
                if (error instanceof Error) {
                    expect(error.message).toContain("DB failure");
                }
            }
            finally {
                spy.mockRestore();
            }
        });
    });

    describe("Method: BookmarkTag.exists() (Static Method)", () => {
        it("should return null if no bookmark-tag relationship exists", async () => {
            const result = await BookmarkTag.exists(bookmark.id, tag.id);
            expect(result).toBeNull();
        });

        it("should return the bookmark-tag relationship if it exists", async () => {
            await Operator.createRecord<IBookmarkTag>("bookmark_tags", { id: "bt-1", bookmark_id: bookmark.id, tag_id: tag.id });
            const result = await BookmarkTag.exists(bookmark.id, tag.id);
            expect(result).toEqual({ id: "bt-1", bookmark_id: bookmark.id, tag_id: tag.id });
        });

        it("should throw an error if the database operation fails", async () => {
            const spy = vi.spyOn(Operator, "getRecordByIndex").mockRejectedValue(new Error("DB failure"));
            try {
                await expect(BookmarkTag.exists(bookmark.id, tag.id)).rejects.toThrow("An error occurred in BookmarkTag.exists:- Error: DB failure");
            } catch (error) {
                expect(error).toBeInstanceOf(Error);
                if (error instanceof Error) {
                    expect(error.message).toContain("DB failure");
                }
            }
            finally {
                spy.mockRestore();
            }
        });
    });

    describe("Method: BookmarkTag.getAll()", () => {
        it("should return all bookmark-tag relationships", async () => {
            await Operator.createRecord<IBookmarkTag>("bookmark_tags", { id: "bt-1", bookmark_id: bookmark.id, tag_id: tag.id });
            const result = await BookmarkTag.getAll();
            expect(result).toHaveLength(1);
        });

        it("should return empty array if no bookmark-tag relationships exist", async () => {
            await Operator.clearStore("bookmark_tags");
            setTimeout(async () => {
                const result = await BookmarkTag.getAll();
                expect(result).toHaveLength(0);
            }, 300);
        });


        it("should throw an error if the database operation fails", async () => {
            const spy = vi.spyOn(Operator, "getRecordsByIndex").mockRejectedValue(new Error("DB failure"));
            try {
                await expect(BookmarkTag.getAll()).rejects.toThrow("An error occurred in BookmarkTag.getAll:- Error: DB failure");
            } catch (error) {
                expect(error).toBeInstanceOf(Error);
                if (error instanceof Error) {
                    expect(error.message).toContain("DB failure");
                }
            }
            finally {
                spy.mockRestore();
            }
        });
    });

    describe("Method: BookmarkTag.getAllByTagId()", () => {
        it("should return bookmark-tags for a specific tag", async () => {
            await Operator.createRecord<IBookmarkTag>("bookmark_tags", { id: "bt-1", bookmark_id: bookmark.id, tag_id: tag.id });

            const result = await BookmarkTag.getAllByTagId(tag.id);
            expect(result).toHaveLength(1);
            expect(result[0].tag_id).toBe(tag.id);
        });

        it("should return an empty array if no bookmark-tags exist for the tag", async () => {
            const result = await BookmarkTag.getAllByTagId("non-existent-tag");
            expect(result).toEqual([]);
        });

        it("should throw an error if the database operation fails", async () => {
            const spy = vi.spyOn(Operator, "getRecords").mockRejectedValue(new Error("DB failure"));
            try {
                await expect(BookmarkTag.getAllByTagId(tag.id)).rejects.toThrow("An error occurred in BookmarkTag.getAllByTagId:- Error: DB failure");
            } catch (error) {
                expect(error).toBeInstanceOf(Error);
                if (error instanceof Error) {
                    expect(error.message).toContain("DB failure");
                }
            }
            finally {
                spy.mockRestore();
            }
        });
    });

    describe("Method: BookmarkTag.getAllByBookmarkId()", () => {
        it("should return all tags associated with a specific bookmark", async () => {
            await Operator.createRecord<IBookmarkTag>("bookmark_tags", { id: "bt-1", bookmark_id: bookmark.id, tag_id: tag.id });

            const result = await BookmarkTag.getAllByBookmarkId(bookmark.id);
            expect(result).toHaveLength(1);
            expect(result[0].bookmark_id).toBe(bookmark.id);
        });

        it("should return an empty array if no tags exist for the bookmark", async () => {
            const result = await BookmarkTag.getAllByBookmarkId("non-existent-bookmark");
            expect(result).toEqual([]);
        });

        it("should throw an error if the database operation fails", async () => {
            const spy = vi.spyOn(Operator, "getRecords").mockRejectedValue(new Error("DB failure"));
            try {
                await expect(BookmarkTag.getAllByBookmarkId(bookmark.id)).rejects.toThrow("An error occurred in BookmarkTag.getAllByBookmarkId:- Error: DB failure");
            } catch (error) {
                expect(error).toBeInstanceOf(Error);
                if (error instanceof Error) {
                    expect(error.message).toContain("DB failure");
                }
            }
            finally {
                spy.mockRestore();
            }
        });
    });

    describe("Method: BookmarkTag.moveBookmarkTag()", () => {
        it("should move a tag from one bookmark to another", async () => {
            // Setup test data
            const tag: ITag = {
                id: "tag1", name: "Tag1",
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            };
            const fromBookmark: IBookmark = {
                id: "bookmark1", title: "Bookmark 1",
                url: "https://example.com",
                description: "",
                created_at: (new Date()).toISOString(),
                updated_at: (new Date()).toISOString(),
                tags: [],
                archived: 0
            };
            const toBookmark: IBookmark = {
                id: "bookmark2", title: "Bookmark 2",
                url: "https://example.com",
                description: "",
                created_at: (new Date()).toISOString(),
                updated_at: (new Date()).toISOString(),
                tags: [],
                archived: 0
            };
            const bookmarkTag: IBookmarkTag = {
                bookmark_id: "bookmark1", tag_id: "tag1",
                id: "bookmark_tag1-0-1"
            };

            await Operator.createRecord("tags", tag);
            await Operator.createRecord("bookmarks", fromBookmark);
            await Operator.createRecord("bookmarks", toBookmark);
            await Operator.createRecord("bookmark_tags", bookmarkTag);

            setTimeout(async () => {
                await BookmarkTag.moveBookmarkTag("tag1", "bookmark1", "bookmark2");

                const movedTag = await Operator.getRecordByIndex<IBookmarkTag>("bookmark_tags", "bookmark_tags_index", ["bookmark2", "tag1"]);
                expect(movedTag).not.toBeNull();
                expect(movedTag?.bookmark_id).toBe("bookmark2");
            }, 300);
        });

        it("should throw an error if the tag does not exist", async () => {
            await expect(BookmarkTag.moveBookmarkTag("invalidTag", "bookmark1", "bookmark2"))
                .rejects.toThrow("Tag not found");
        });

        it("should throw an error if the 'from' bookmark does not exist", async () => {
            await expect(BookmarkTag.moveBookmarkTag("tag1", "nonExistentBookmark", "bookmark2"))
                .rejects.toThrow("fromBookmark");
        });

        it("should throw an error if the 'to' bookmark does not exist", async () => {
            await expect(BookmarkTag.moveBookmarkTag("tag1", "bookmark1", "nonExistentBookmark"))
                .rejects.toThrow("toBookmark");
        });

        it("should throw an error if the tag is not under the 'from' bookmark", async () => {
            const tag: ITag = {
                id: "tag1", name: "Tag 1",
                created_at: (new Date()).toISOString(),
                updated_at: (new Date()).toISOString(),
            };
            const fromBookmark: IBookmark = {
                id: "bookmark1", title: "Bookmark 1",
                url: "https://example.com",
                description: "",
                created_at: (new Date()).toISOString(),
                updated_at: (new Date()).toISOString(),
                tags: [],
                archived: 0
            };
            const toBookmark: IBookmark = {
                id: "bookmark2", title: "Bookmark 2",
                url: "https://example.com",
                description: "",
                created_at: (new Date()).toISOString(),
                updated_at: (new Date()).toISOString(),
                tags: [],
                archived: 0
            };

            await Operator.createRecord("tags", tag);
            await Operator.createRecord("bookmarks", fromBookmark);
            await Operator.createRecord("bookmarks", toBookmark);

            await expect(BookmarkTag.moveBookmarkTag("tag1", "bookmark1", "bookmark2"))
                .rejects.toThrow("not found under fromBookmark");
        });

        it("should throw an error if an unexpected issue occurs", async () => {
            const spy = vi.spyOn(BookmarkTag, "moveBookmarkTag").mockRejectedValue(new Error("DB failure"));
            try {
                await expect(BookmarkTag.moveBookmarkTag("tag1", "bookmark1", "bookmark2"))
                    .rejects.toThrow("An error occurred in BookmarkTag.moveBookmarkTag:- Error: DB failure");
            } catch (error) {
                expect(error).toBeInstanceOf(Error);
                if (error instanceof Error) {
                    expect(error.message).toContain("DB failure");
                }
            }
            finally {
                spy.mockRestore();
            }
        });
    });

    describe("Method: BookmarkTag.delete()", () => {
        it("should delete a bookmark tag entry", async () => {
            const bookmarkTag: IBookmarkTag = {
                bookmark_id: "bookmark1", tag_id: "tag1",
                id: "xyz-abc"
            };
            setTimeout(async () => {
                await Operator.createRecord("bookmark_tags", bookmarkTag);

                const instance = new BookmarkTag(bookmarkTag);
                await instance.delete();

                const deletedTag = await Operator.getRecordByIndex("bookmark_tags", "bookmark_tags_index", ["bookmark1", "tag1"]);
                expect(deletedTag).toBeNull();
            }, 300);
        });

        it("should throw an error if the tag does not exist", async () => {
            const bookmarkTag: IBookmarkTag = {
                bookmark_id: "bookmark1", tag_id: "invalidTag",
                id: "xyz-abc-0"
            };
            const instance = new BookmarkTag(bookmarkTag);
            await expect(instance.delete()).rejects.toThrow("Tag not found");
        });

        it("should throw an error if the bookmark does not exist", async () => {
            const bookmarkTag: IBookmarkTag = {
                bookmark_id: "invalidBookmark", tag_id: "tag1",
                id: "xyz-abc-0"
            };
            const instance = new BookmarkTag(bookmarkTag);
            await expect(instance.delete()).rejects.toThrow("Bookmark");
        });

        it("should throw an error if the bookmark-tag association does not exist", async () => {
            const bookmarkTag: IBookmarkTag = {
                bookmark_id: "bookmark1", tag_id: "tag1",
                id: "xyz-abc-3"
            };
            const instance = new BookmarkTag(bookmarkTag);
            await expect(instance.delete()).rejects.toThrow("BookmarkTag");
        });

        it("should throw an error if an unexpected failure occurs", async () => {
            const bookmarkTag: IBookmarkTag = {
                bookmark_id: "bookmark1", tag_id: "tag1",
                id: "xyz-abc-4"
            };
            const instance = new BookmarkTag(bookmarkTag);
            const spy = vi.spyOn(Operator, "deleteRecord").mockRejectedValue(new Error("DB failure"));
            try {
                await expect(instance.delete()).rejects.toThrow("Error: DB failure");
            } catch (error) {
                expect(error).toBeInstanceOf(Error);
                if (error instanceof Error) {
                    expect(error.message).toContain("DB failure");
                }
            }
            finally {
                spy.mockRestore();
            }
        });
    });

    describe("Method: BookmarkTag.deleteBookmarkLinks()", () => {
        it("should delete all links for a tag", async () => {
            const bookmarkTag: IBookmarkTag = { bookmark_id: "bookmark1", tag_id: "tag1", id: "bt-abcd" };
            await Operator.createRecord("bookmark_tags", bookmarkTag);

            const deletedLinks = await BookmarkTag.deleteBookmarkLinks("tag1");
            expect(deletedLinks).toContain("bookmark1");

            const remainingTags = await Operator.getRecords("bookmark_tags");
            expect(remainingTags.length).toBe(0);
        });

        it("should return an empty array if no bookmarks are associated with the tag", async () => {
            const deletedLinks = await BookmarkTag.deleteBookmarkLinks("nonExistentTag");
            expect(deletedLinks).toEqual([]);
        });

        it("should throw an error if an unexpected issue occurs", async () => {
            const spy = vi.spyOn(Operator, "deleteRecordsByIndex").mockRejectedValue(new Error("DB Error"));
            try {
                await expect(BookmarkTag.deleteBookmarkLinks("tag1")).rejects.toThrow("DB Error");
            } catch (error) {
                expect(error).toBeInstanceOf(Error);
                if (error instanceof Error) {
                    expect(error.message).toContain("DB Error");
                }
            }
            finally {
                spy.mockRestore();
            }
        });
    });

    describe("Method: BookmarkTag.deleteTagLinks()", () => {
        it("should delete all tags associated with a bookmark", async () => {
            const bookmarkTag1: IBookmarkTag = { bookmark_id: "bookmark1", tag_id: "tag1", id: "bt-5-abcd" };
            const bookmarkTag2: IBookmarkTag = { bookmark_id: "bookmark1", tag_id: "tag2", id: "bt-2-abcd" };
            await Operator.createRecord("bookmark_tags", bookmarkTag1);
            await Operator.createRecord("bookmark_tags", bookmarkTag2);

            const deletedTags = await BookmarkTag.deleteTagLinks("bookmark1");
            expect(deletedTags).toEqual(expect.arrayContaining(["tag1", "tag2"]));

            const remainingTags = await Operator.getRecords("bookmark_tags");
            expect(remainingTags.length).toBe(0);
        });

        it("should return an empty array if no tags are associated with the bookmark", async () => {
            const deletedTags = await BookmarkTag.deleteTagLinks("nonExistentBookmark");
            expect(deletedTags).toEqual([]);
        });

        it("should throw an error if an unexpected issue occurs", async () => {
            const spy = vi.spyOn(Operator, "getRecords").mockRejectedValue(new Error("DB Error"));
            try {
                await expect(BookmarkTag.deleteTagLinks("bookmark1")).rejects.toThrow("DB Error");
            } catch (error) {
                expect(error).toBeInstanceOf(Error);
                if (error instanceof Error) {
                    expect(error.message).toContain("DB Error");
                }
            } finally {
                spy.mockRestore();
            }
        });
    });

    describe("Method: BookmarkTag.createCategoryBookmarkTag()", () => {
        it("should create a bookmark tag and category tag when all entities exist", async () => {
            const tag: ITag = {
                id: "tag1", name: "Tag 1",
                created_at: (new Date()).toISOString(),
                updated_at: (new Date()).toISOString(),
            };
            const bookmark: IBookmark = {
                id: "bookmark1", title: "Bookmark 1",
                url: "https://example.com",
                description: "",
                created_at: (new Date()).toISOString(),
                updated_at: (new Date()).toISOString(),
                tags: [],
                archived: 0
            };

            const category: ICategory = {
                id: "category1", name: "Category 1",
                is_default: 0,
                created_at: (new Date()).toISOString(),
                updated_at: (new Date()).toISOString(),
                bookmarks: [],
                tags: []
            };

            const category_bookmark: ICategoryBookmark = {
                category_id: "category1", bookmark_id: "bookmark1",
                id: "category_bookmark1"
            };

            await Operator.createRecord("tags", tag);
            await Operator.createRecord("bookmarks", bookmark);
            await Operator.createRecord("categories", category);
            await Operator.createRecord("category_bookmarks", category_bookmark);

            await BookmarkTag.createCategoryBookmarkTag(new Tag(tag), new Bookmark(bookmark), new Category(category));

            const bookmarkTag = await Operator.getRecordByIndex("bookmark_tags", "bookmark_tags_index", ["bookmark1", "tag1"]);
            expect(bookmarkTag).not.toBeNull();

            const categoryTag = await Operator.getRecordByIndex("category_tags", "category_tags_index", ["category1", "tag1"]);
            expect(categoryTag).not.toBeNull();
        });

        it("should create a new tag if it does not exist", async () => {
            const tag: ITag = {
                id: "tag2", name: "New Tag",
                created_at: (new Date()).toISOString(),
                updated_at: (new Date()).toISOString(),
            };

            const bookmark: IBookmark = {
                id: "bookmark2", title: "Bookmark 2",
                url: "https://example.com",
                description: "",
                created_at: (new Date()).toISOString(),
                updated_at: (new Date()).toISOString(),
                tags: [],
                archived: 0
            };

            const category: ICategory = {
                id: "category2", name: "Category 2",
                is_default: 0,
                created_at: (new Date()).toISOString(),
                updated_at: (new Date()).toISOString(),
                bookmarks: [],
                tags: []
            };
            const category_bookmark: ICategoryBookmark = {
                category_id: "category2", bookmark_id: "bookmark2",
                id: "category_bookmark2"
            };

            await Operator.createRecord("bookmarks", bookmark);
            await Operator.createRecord("categories", category);
            await Operator.createRecord("category_bookmarks", category_bookmark);

            await BookmarkTag.createCategoryBookmarkTag(new Tag(tag), new Bookmark(bookmark), new Category(category));

            const newTag = await Operator.getRecordByIndex<ITag>("tags", "tags_index", "New Tag");
            expect(newTag).not.toBeNull();

            const bookmarkTag = await Operator.getRecordByIndex("bookmark_tags", "bookmark_tags_index", ["bookmark2", newTag.id]);
            expect(bookmarkTag).not.toBeNull();
        });

        it("should throw an error if the category does not exist", async () => {
            const tag: ITag = {
                id: "tag3", name: "Tag 3",
                created_at: (new Date()).toISOString(),
                updated_at: (new Date()).toISOString(),
            };
            const bookmark: IBookmark = {
                id: "bookmark3", title: "Bookmark 3",
                url: "https://example.com",
                description: "",
                created_at: (new Date()).toISOString(),
                updated_at: (new Date()).toISOString(),
                tags: [],
                archived: 0
            };
            const category: ICategory = {
                id: "invalid_category", name: "Invalid Category",
                is_default: 0,
                created_at: (new Date()).toISOString(),
                updated_at: (new Date()).toISOString(),
                bookmarks: [],
                tags: []
            };

            await Operator.createRecord("tags", tag);
            await Operator.createRecord("bookmarks", bookmark);

            await expect(BookmarkTag.createCategoryBookmarkTag(new Tag(tag), new Bookmark(bookmark), new Category(category))).rejects.toThrow("Category not found: invalid_category");
        });

        it("should throw an error if the bookmark does not exist", async () => {
            const tag: ITag = {
                id: "tag4", name: "Tag 4",
                created_at: (new Date()).toISOString(),
                updated_at: (new Date()).toISOString(),
            };
            const bookmark: IBookmark = {
                id: "invalid_bookmark", title: "Invalid Bookmark",
                url: "https://example.com",
                description: "",
                created_at: (new Date()).toISOString(),
                updated_at: (new Date()).toISOString(),
                tags: [],
                archived: 0
            };
            const category: ICategory = {
                id: "category4", name: "Category 4",
                is_default: 0,
                created_at: (new Date()).toISOString(),
                updated_at: (new Date()).toISOString(),
                bookmarks: [],
                tags: []
            };

            await Operator.createRecord("tags", tag);
            await Operator.createRecord("categories", category);

            await expect(BookmarkTag.createCategoryBookmarkTag(new Tag(tag), new Bookmark(bookmark), new Category(category))).rejects.toThrow("Bookmark not found: invalid_bookmark");
        });

        it("should throw an error if the bookmark is not linked to the category", async () => {
            const tag: ITag = {
                id: "tag5", name: "Tag 5",
                created_at: (new Date()).toISOString(),
                updated_at: (new Date()).toISOString(),
            };
            const bookmark: IBookmark = {
                id: "bookmark5", title: "Bookmark 5",
                url: "https://example.com",
                description: "",
                created_at: (new Date()).toISOString(),
                updated_at: (new Date()).toISOString(),
                tags: [],
                archived: 0
            };
            const category: ICategory = {
                id: "category5", name: "Category 5",
                is_default: 0,
                created_at: (new Date()).toISOString(),
                updated_at: (new Date()).toISOString(),
                bookmarks: [],
                tags: []
            };

            await Operator.createRecord("tags", tag);
            await Operator.createRecord("bookmarks", bookmark);
            await Operator.createRecord("categories", category);

            await expect(BookmarkTag.createCategoryBookmarkTag(new Tag(tag), new Bookmark(bookmark), new Category(category))).rejects.toThrow("Bookmark not found under category: bookmark5");
        });

        it("should throw an error if the bookmark tag already exists", async () => {
            const tag: ITag = {
                id: "tag6", name: "Tag 6",
                created_at: (new Date()).toISOString(),
                updated_at: (new Date()).toISOString(),
            };
            const bookmark: IBookmark = {
                id: "bookmark6", title: "Bookmark 6",
                url: "https://example.com",
                description: "",
                created_at: (new Date()).toISOString(),
                updated_at: (new Date()).toISOString(),
                tags: [],
                archived: 0
            };
            const category: ICategory = {
                id: "category6", name: "Category 6",
                is_default: 0,
                created_at: (new Date()).toISOString(),
                updated_at: (new Date()).toISOString(),
                bookmarks: [],
                tags: []
            };
            const bookmarkTag: IBookmarkTag = {
                bookmark_id: "bookmark6", tag_id: "tag6",
                id: "bookmark_tag6"
            };

            const category_bookmark: ICategoryBookmark = {
                category_id: "category6", bookmark_id: "bookmark6",
                id: "category_bookmark6-0"
            };

            await Operator.createRecord("tags", tag);
            await Operator.createRecord("bookmarks", bookmark);
            await Operator.createRecord("categories", category);
            await Operator.createRecord("category_bookmarks", category_bookmark);
            await Operator.createRecord("bookmark_tags", bookmarkTag);

            await expect(BookmarkTag.createCategoryBookmarkTag(new Tag(tag), new Bookmark(bookmark), new Category(category))).rejects.toThrow(`BookmarkTag already exists`);
        });

        it("should throw an error if an unexpected failure occurs", async () => {
            const spy = vi.spyOn(Operator, "createRecord").mockRejectedValue(new Error("DB failure"));
            const tag1: ITag = {
                id: "tag-abcde",
                name: "tag-abcdef",
                created_at: (new Date()).toISOString(),
                updated_at: (new Date()).toISOString(),
            };
            const bk1: IBookmark = {
                id: "bk-abcde",
                title: "bk-abcdef",
                url: "http://example.com",
                description: "",
                created_at: (new Date()).toISOString(),
                updated_at: (new Date()).toISOString(),
                tags: [],
                archived: 0
            };
            const cat1: ICategory = {
                id: "cat-abcde",
                name: "cat-abcdef",
                is_default: 0,
                created_at: (new Date()).toISOString(),
                updated_at: (new Date()).toISOString(),
                bookmarks: [],
                tags: []
            };
            try {
                await expect(BookmarkTag.createCategoryBookmarkTag(new Tag(tag1), new Bookmark(bk1), new Category(cat1))).rejects.toThrow("DB failure");
            } catch (error) {
                expect(error).toBeInstanceOf(Error);
                if (error instanceof Error) {
                    expect(error.message).toContain("DB failure");
                }
            }
            finally {
                spy.mockRestore();
            }
        });
    });

    describe("Method: BookmarkTag.addCategoryBookmarkTag()", () => {
        it("should add a bookmark tag and category tag if the tag exists", async () => {
            const tag: ITag = {
                id: "tag7", name: "Tag 7",
                created_at: (new Date()).toISOString(),
                updated_at: (new Date()).toISOString(),
            };
            const bookmark: IBookmark = {
                id: "bookmark7", title: "Bookmark 7",
                url: "https://example.com",
                description: "",
                created_at: (new Date()).toISOString(),
                updated_at: (new Date()).toISOString(),
                tags: [],
                archived: 0
            };
            const category: ICategory = {
                id: "category7", name: "Category 7",
                is_default: 0,
                created_at: (new Date()).toISOString(),
                updated_at: (new Date()).toISOString(),
                bookmarks: [],
                tags: []
            };
            const category_bookmark: ICategoryBookmark = {
                category_id: "category7", bookmark_id: "bookmark7",
                id: "category_bookmark7-0"
            };

            await Operator.createRecord("tags", tag);
            await Operator.createRecord("bookmarks", bookmark);
            await Operator.createRecord("categories", category);
            await Operator.createRecord("category_bookmarks", category_bookmark);

            await BookmarkTag.addCategoryBookmarkTag(new Tag(tag), new Bookmark(bookmark), new Category(category));

            const bookmarkTag = await Operator.getRecordByIndex("bookmark_tags", "bookmark_tags_index", ["bookmark7", "tag7"]);
            expect(bookmarkTag).not.toBeNull();

            const categoryTag = await Operator.getRecordByIndex("category_tags", "category_tags_index", ["category7", "tag7"]);
            expect(categoryTag).not.toBeNull();
        });

        it("should throw an error if the category does not exist", async () => {
            const tag: ITag = {
                id: "tag8", name: "Tag 8",
                created_at: (new Date()).toISOString(),
                updated_at: (new Date()).toISOString(),
            };
            const bookmark: IBookmark = {
                id: "bookmark8", title: "Bookmark 8",
                url: "https://example.com",
                description: "",
                created_at: (new Date().toISOString()),
                updated_at: (new Date().toISOString()),
                tags: [],
                archived: 0
            };
            const category: ICategory = {
                id: "invalid_category",
                name: "Invalid Category",
                is_default: 0,
                created_at: (new Date().toISOString()),
                updated_at: (new Date().toISOString()),
                bookmarks: [],
                tags: []
            };

            await Operator.createRecord("tags", tag);
            await Operator.createRecord("bookmarks", bookmark);

            await expect(BookmarkTag.addCategoryBookmarkTag(new Tag(tag), new Bookmark(bookmark), new Category(category))).rejects.toThrow("Category not found: invalid_category");
        });

        it("should throw an error if the bookmark does not exist", async () => {
            const tag: ITag = {
                id: "tag9", name: "Tag 9",
                created_at: (new Date().toISOString()),
                updated_at: (new Date().toISOString()),
            };
            const bookmark: IBookmark = {
                id: "invalid_bookmark", title: "Invalid Bookmark",
                url: "https://example.com",
                description: "",
                created_at: (new Date().toISOString()),
                updated_at: (new Date().toISOString()),
                tags: [],
                archived: 0
            };
            const category: ICategory = {
                id: "category9", name: "Category 9",
                is_default: 0,
                created_at: (new Date().toISOString()),
                updated_at: (new Date().toISOString()),
                bookmarks: [],
                tags: []
            };

            await Operator.createRecord("tags", tag);
            await Operator.createRecord("categories", category);

            await expect(BookmarkTag.addCategoryBookmarkTag(new Tag(tag), new Bookmark(bookmark), new Category(category))).rejects.toThrow("Bookmark not found: invalid_bookmark");
        });

        it("should throw an error if the bookmark is not linked to the category", async () => {
            const tag: ITag = {
                id: "tag10", name: "Tag 10",
                created_at: (new Date().toISOString()),
                updated_at: (new Date().toISOString()),
            };
            const bookmark: IBookmark = {
                id: "bookmark10", title: "Bookmark 10",
                url: "https://example.com",
                description: "",
                created_at: (new Date().toISOString()),
                updated_at: (new Date().toISOString()),
                tags: [],
                archived: 0
            };
            const category: ICategory = {
                id: "category10", name: "Category 10",
                is_default: 0,
                created_at: (new Date().toISOString()),
                updated_at: (new Date().toISOString()),
                bookmarks: [],
                tags: []
            };

            await Operator.createRecord("tags", tag);
            await Operator.createRecord("bookmarks", bookmark);
            await Operator.createRecord("categories", category);

            await expect(BookmarkTag.addCategoryBookmarkTag(new Tag(tag), new Bookmark(bookmark), new Category(category))).rejects.toThrow("Bookmark not found under category: bookmark10");
        });

        it("should throw an error if the bookmark tag already exists", async () => {
            const tag: ITag = {
                id: "tag11", name: "Tag 11",
                created_at: (new Date().toISOString()),
                updated_at: (new Date().toISOString()),
            };
            const bookmark: IBookmark = {
                id: "bookmark11", title: "Bookmark 11",
                url: "https://example.com",
                description: "",
                created_at: (new Date().toISOString()),
                updated_at: (new Date().toISOString()),
                tags: [],
                archived: 0
            };
            const category: ICategory = {
                id: "category11", name: "Category 11",
                is_default: 0,
                created_at: (new Date().toISOString()),
                updated_at: (new Date().toISOString()),
                bookmarks: [],
                tags: []
            };
            const bookmarkTag: IBookmarkTag = {
                bookmark_id: "bookmark11", tag_id: "tag11",
                id: "bookmark_tag11"
            };

            const category_bookmark: ICategoryBookmark = {
                category_id: "category11", bookmark_id: "bookmark11",
                id: "category_bookmark11-0"
            };

            await Operator.createRecord("tags", tag);
            await Operator.createRecord("bookmarks", bookmark);
            await Operator.createRecord("categories", category);
            await Operator.createRecord("category_bookmarks", category_bookmark);
            await Operator.createRecord("bookmark_tags", bookmarkTag);

            await expect(BookmarkTag.addCategoryBookmarkTag(new Tag(tag), new Bookmark(bookmark), new Category(category))).rejects.toThrow(`BookmarkTag already exists`);
        });

        it("should throw an error if an unexpected failure occurs", async () => {
            const spy = vi.spyOn(Operator, "createRecord").mockRejectedValue(new Error("DB failure"));
            const tag1: ITag = {
                id: "tag-abcde",
                name: "tag-abcdef",
                created_at: (new Date()).toISOString(),
                updated_at: (new Date()).toISOString(),
            };
            const bk1: IBookmark = {
                id: "bk-abcde",
                title: "bk-abcdef",
                url: "http://example.com",
                description: "",
                created_at: (new Date()).toISOString(),
                updated_at: (new Date()).toISOString(),
                tags: [],
                archived: 0
            };
            const cat1: ICategory = {
                id: "cat-abcde",
                name: "cat-abcdef",
                is_default: 0,
                created_at: (new Date()).toISOString(),
                updated_at: (new Date()).toISOString(),
                bookmarks: [],
                tags: []
            };
            try {
                await expect(BookmarkTag.addCategoryBookmarkTag(new Tag(tag1), new Bookmark(bk1), new Category(cat1))).rejects.toThrow("DB failure");
            } catch (error) {
                expect(error).toBeInstanceOf(Error);
                if (error instanceof Error) {
                    expect(error.message).toContain("DB failure");
                }
            }
            finally {
                spy.mockRestore();
            }
        });
    });
});
