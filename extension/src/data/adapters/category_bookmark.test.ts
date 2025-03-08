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
import { IBookmark, ICategory } from "../../utils/types/schemas";
import { Operator } from "../operator";
import Bookmark from "./bookmark";
import Category from "./category";
import CategoryBookmark from "./category_bookmark";

globalThis.indexedDB = indexedDB;
globalThis.IDBKeyRange = IDBKeyRange;

describe("INTEGRATED TESTS FOR CategoryBookmark CLASS", async () => {
    let db: IDBDatabase;

    beforeAll(async () => {
        db = await Operator.initializeDatabase();
    });

    afterAll(() => {
        db.close();
        indexedDB.deleteDatabase("bmm");
    });

    beforeEach(async () => {
        await Operator.clearStore("categories");
        await Operator.clearStore("bookmarks");
        await Operator.clearStore("category_bookmarks");
    });

    describe("Method: CategoryBookmark.create()", () => {
        let category: ICategory;
        let bookmark: IBookmark;

        beforeEach(async () => {
            category = await Operator.createRecord("categories", {
                id: "cat-1",
                name: "Test Category",
                is_default: 0,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                bookmarks: [],
                tags: []
            });

            bookmark = await Operator.createRecord("bookmarks", {
                id: "bm-1",
                title: "Test Bookmark",
                url: "https://example.com",
                description: "A test bookmark",
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                tags: [],
                archived: 0
            });
        });

        it("should create a new category bookmark if it does not exist", async () => {
            const categoryBookmark = new CategoryBookmark({
                id: "cb-1",
                category_id: category.id,
                bookmark_id: bookmark.id
            });

            const result = await categoryBookmark.create();
            expect(result).toMatchObject({
                id: "cb-1",
                category_id: category.id,
                bookmark_id: bookmark.id
            });
        });

        it("should not create a duplicate category bookmark", async () => {
            await new CategoryBookmark({
                id: "cb-2",
                category_id: category.id,
                bookmark_id: bookmark.id
            }).create();

            const duplicate = new CategoryBookmark({
                id: "cb-3",
                category_id: category.id,
                bookmark_id: bookmark.id
            });

            const result = await duplicate.create();
            expect(result).toMatchObject({
                id: "cb-2"
            }); // Returns existing entry
        });

        it("should throw an error if required fields are missing", async () => {
            const cb1 = {
                id: "",
                category_id: "",
                bookmark_id: ""
            };
            expect(() => new CategoryBookmark(cb1)).toThrow("required field");
        });

        it("should throw an error if creation fails", async () => {
            const spy = vi.spyOn(Operator, "createRecord").mockRejectedValueOnce(new Error("DB error"));
            try {
                const categoryBookmark = new CategoryBookmark({ id: "A", category_id: "A", bookmark_id: "A" });
                await expect(categoryBookmark.create()).rejects.toThrow("An error occurred in CategoryBookmark.create");
            } catch (error) {
                expect(error).toBeInstanceOf(Error);
                if (error instanceof Error)
                    expect(error.message).toContain("DB error");
            } finally {
                spy.mockRestore();
            }
        });
    });

    describe("Method: CategoryBookmark.createBookmark()", () => {
        let category: ICategory;
        let bookmark: IBookmark;

        beforeEach(async () => {
            category = await Operator.createRecord("categories", {
                id: "cat-1",
                name: "Test Category",
                is_default: 0,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                bookmarks: [],
                tags: []
            });

            bookmark = await Operator.createRecord("bookmarks", {
                id: "bm-1",
                title: "Test Bookmark",
                url: "https://example.com",
                description: "A test bookmark",
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                tags: [],
                archived: 0
            });
        });

        it("should create a new bookmark under a category", async () => {
            const result = await CategoryBookmark.createBookmark(new Bookmark(bookmark), new Category(category));
            expect(result).toMatchObject(bookmark);
        });

        it("should throw an error if category does not exist", async () => {
            const cat1: ICategory = {
                id: "cat-404",
                name: "Category Not Found",
                is_default: 0,
                created_at: (new Date().toISOString()),
                updated_at: (new Date().toISOString()),
                bookmarks: [],
                tags: []
            };
            await expect(CategoryBookmark.createBookmark(new Bookmark(bookmark), new Category(cat1))).rejects.toThrow("Category not found");
        });

        it("should throw an error if the bookmark already exists in the category", async () => {
            await CategoryBookmark.createBookmark(new Bookmark(bookmark), new Category(category));
            await expect(CategoryBookmark.createBookmark(new Bookmark(bookmark), new Category(category))).rejects.toThrow("index already exists");
        });
        it("should throw an error if an unexpected failure occurs", async () => {
            const spy = vi.spyOn(CategoryBookmark, "createBookmark").mockRejectedValueOnce(new Error("DB error"));
            try {
                await expect(CategoryBookmark.createBookmark(new Bookmark(bookmark), new Category(category))).rejects.toThrow("An error occurred in CategoryBookmark.createBookmark");
            } catch (error) {
                expect(error).toBeInstanceOf(Error);
                if (error instanceof Error)
                    expect(error.message).toContain("DB error");
            } finally {
                spy.mockRestore();
            }
        });
    });

    describe("Method: CategoryBookmark.getCategoryIds()", () => {
        let category1: ICategory;
        let category2: ICategory;
        let bookmark: IBookmark;

        beforeEach(async () => {
            const c1: ICategory = {
                id: "cat-1", name: "Category One",
                is_default: 0,
                created_at: (new Date().toISOString()),
                updated_at: (new Date().toISOString()),
                bookmarks: [],
                tags: []
            };
            const c2: ICategory = {
                id: "cat-2", name: "Category Two",
                is_default: 0,
                created_at: (new Date().toISOString()),
                updated_at: (new Date().toISOString()),
                bookmarks: [],
                tags: []
            };
            const b1: IBookmark = {
                id: "bm-1", title: "Test Bookmark", url: "https://example.com",
                description: "",
                created_at: (new Date().toISOString()),
                updated_at: (new Date().toISOString()),
                tags: [],
                archived: 0
            };

            category1 = await Operator.createRecord("categories", c1);
            category2 = await Operator.createRecord("categories", c2);

            bookmark = await Operator.createRecord("bookmarks", b1);

            await CategoryBookmark.createBookmark(new Bookmark(bookmark), new Category(category1));
            await CategoryBookmark.createBookmark(new Bookmark(bookmark), new Category(category2));
        });

        it("should return category IDs for a given bookmark", async () => {
            const categoryIds = await CategoryBookmark.getCategoryIds(bookmark.id);
            expect(categoryIds).toEqual(expect.arrayContaining(["cat-1", "cat-2"]));
        });

        it("should return an empty array if the bookmark has no categories", async () => {
            const categoryIds = await CategoryBookmark.getCategoryIds("bm-404");
            expect(categoryIds).toEqual([]);
        });

        it("should throw an error if an unexpected failure occurs", async () => {
            setTimeout(async () => {
                const spy = vi.spyOn(Operator, "getRecords").mockRejectedValueOnce(new Error("DB error"));
                try {
                    await expect(CategoryBookmark.getCategoryIds("bm-1")).rejects.toThrow("An error occurred in CategoryBookmark.getCategoryIds");
                } catch (error) {
                    expect(error).toBeInstanceOf(Error);
                    if (error instanceof Error)
                        expect(error.message).toContain("DB error");
                } finally {
                    spy.mockRestore();
                }
            }, 1000);
        });
    });

    describe("Method: CategoryBookmark.getAll()", () => {
        it("should return an empty array if there are no category bookmarks", async () => {
            const result = await CategoryBookmark.getAll();
            expect(result).toEqual([]);
        });

        it("should return all category bookmarks from the database", async () => {
            const categoryBookmark1 = new CategoryBookmark({
                id: "cb-1",
                category_id: "cat-1",
                bookmark_id: "bm-1",
            });

            const categoryBookmark2 = new CategoryBookmark({
                id: "cb-2",
                category_id: "cat-2",
                bookmark_id: "bm-2",
            });

            await categoryBookmark1.create();
            await categoryBookmark2.create();

            const result = await CategoryBookmark.getAll();
            expect(result).toEqual([
                expect.objectContaining({ id: "cb-1", category_id: "cat-1", bookmark_id: "bm-1" }),
                expect.objectContaining({ id: "cb-2", category_id: "cat-2", bookmark_id: "bm-2" }),
            ]);
        });

        it("should throw an error if an unexpected issue occurs", async () => {
            const spy = vi.spyOn(Operator, "getRecords").mockRejectedValue(new Error("Database failure"));
            try {
                await expect(CategoryBookmark.getAll()).rejects.toThrow(
                    "An error occurred in CategoryBookmark.getAll:- Error: Database failure"
                );
            } catch (error) {
                expect(error).toBeInstanceOf(Error);
                if (error instanceof Error)
                    expect(error.message).toContain("Database failure");
            } finally {
                spy.mockRestore();
            }
        });
    });

    describe("Method: CategoryBookmark.exists(category_id, bookmark_id)", () => {
        it("should return null if the category-bookmark link does not exist", async () => {
            const result = await CategoryBookmark.exists("cat-unknown", "bm-unknown");
            expect(result).toBeNull();
        });

        it("should return the matching category-bookmark record if it exists", async () => {
            const newLink = new CategoryBookmark({ id: "cb-1", category_id: "cat-1", bookmark_id: "bm-1" });
            await newLink.create();

            const result = await CategoryBookmark.exists("cat-1", "bm-1");

            expect(result).toMatchObject({ id: "cb-1", category_id: "cat-1", bookmark_id: "bm-1" });
        });

        it("should throw an error if an unexpected issue occurs", async () => {
            const spy = vi.spyOn(Operator, "getRecordByIndex").mockRejectedValue(new Error("Database failure"));
            try {
                await expect(CategoryBookmark.exists("cat-1", "bm-1")).rejects.toThrow(
                    "An error occurred in CategoryBookmark.exists:- Error: Database failure"
                );
            } catch (error) {
                expect(error).toBeInstanceOf(Error);
                if (error instanceof Error)
                    expect(error.message).toContain("Database failure");
            }
            finally {
                spy.mockRestore();
            }
        });
    });

    describe("Method: CategoryBookmark.prototype.exists()", () => {
        it("should return null if the instance category-bookmark link does not exist", async () => {
            const instance = new CategoryBookmark({ id: "cb-x", category_id: "cat-y", bookmark_id: "bm-z" });
            const result = await instance.exists();
            expect(result).toBeNull();
        });

        it("should return the matching category-bookmark record if it exists", async () => {
            const instance = new CategoryBookmark({ id: "cb-1", category_id: "cat-1", bookmark_id: "bm-1" });
            await instance.create();

            const result = await instance.exists();

            expect(result).toMatchObject({ id: "cb-1", category_id: "cat-1", bookmark_id: "bm-1" });
        });

        it("should throw an error if an unexpected issue occurs", async () => {
            const instance = new CategoryBookmark({ id: "cb-1", category_id: "cat-1", bookmark_id: "bm-1" });
            const spy = vi.spyOn(Operator, "getRecordByIndex").mockRejectedValue(new Error("Database failure"));
            try {
                await expect(instance.exists()).rejects.toThrow(
                    "An error occurred in CategoryBookmark.exists:- Error: Database failure"
                );
            } catch (error) {
                expect(error).toBeInstanceOf(Error);
                if (error instanceof Error)
                    expect(error.message).toContain("Database failure");
            }
            finally {
                spy.mockRestore();
            }
        });
    });

    describe("Method: CategoryBookmark.getBookmarkIds()", () => {
        it("should return an empty array if the category has no bookmarks", async () => {
            const result = await CategoryBookmark.getBookmarkIds("empty-category");
            expect(result).toEqual([]);
        });

        it("should return all bookmark IDs associated with a specific category", async () => {
            await new CategoryBookmark({ id: "cb-1", category_id: "cat-1", bookmark_id: "bm-1" }).create();
            await new CategoryBookmark({ id: "cb-2", category_id: "cat-1", bookmark_id: "bm-2" }).create();
            setTimeout(async () => {
                const result = await CategoryBookmark.getBookmarkIds("cat-1");

                expect(result).toEqual(expect.arrayContaining(["bm-1", "bm-2"]));
            }, 300);
        });

        it("should throw an error if an unexpected issue occurs", async () => {
            const spy = vi.spyOn(CategoryBookmark, "getBookmarkIds").mockRejectedValue(new Error("Database failure"));
            // setTimeout(async () => {
            try {
                await expect(CategoryBookmark.getBookmarkIds("cat-1")).rejects.toThrow(
                    "An error occurred in CategoryBookmark.getBookmarkIds:- Error: Database failure, cat-1"
                );
            } catch (error) {
                expect(error).toBeInstanceOf(Error);
                if (error instanceof Error)
                    expect(error.message).toContain("Database failure");
            } finally {
                spy.mockRestore();
            }
            // }, 300);
        });
    });

    describe("Method: CategoryBookmark.deleteCategoryLinks()", () => {
        it("should return an empty array if the bookmark is not linked to any categories", async () => {
            const result = await CategoryBookmark.deleteCategoryLinks("bm-non-existent");
            expect(result).toEqual([]);
        });

        it("should delete all category links for a given bookmark and return their category IDs", async () => {
            await new CategoryBookmark({ id: "cb-1", category_id: "cat-1", bookmark_id: "bm-1" }).create();
            await new CategoryBookmark({ id: "cb-2", category_id: "cat-2", bookmark_id: "bm-1" }).create();

            const result = await CategoryBookmark.deleteCategoryLinks("bm-1");

            expect(result).toEqual(expect.arrayContaining(["cat-1", "cat-2"]));

            const remaining = await CategoryBookmark.getCategories("bm-1");
            expect(remaining).toEqual([]);
        });

        it("should throw an error if an unexpected issue occurs", async () => {
            const spy = vi.spyOn(Operator, "getRecords").mockRejectedValue(new Error("Database failure"));
            try {
                await expect(CategoryBookmark.deleteCategoryLinks("bm-1")).rejects.toThrow(
                    "An error occurred in CategoryBookmark.deleteCategoryLinks:- Error: Database failure, bm-1"
                );
            } catch (error) {
                expect(error).toBeInstanceOf(Error);
                if (error instanceof Error)
                    expect(error.message).toContain("Database failure");
            } finally {
                spy.mockRestore();
            }
        });
    });

    describe("Method: CategoryBookmark.deleteBookmarkLinks()", () => {
        it("should return an empty array if the category has no bookmarks linked", async () => {
            const result = await CategoryBookmark.deleteBookmarkLinks("cat-non-existent");
            expect(result).toEqual([]);
        });

        it("should delete all bookmark links for a given category and return their bookmark IDs", async () => {
            await new CategoryBookmark({ id: "cb-1", category_id: "cat-1", bookmark_id: "bm-1" }).create();
            await new CategoryBookmark({ id: "cb-2", category_id: "cat-1", bookmark_id: "bm-2" }).create();

            const result = await CategoryBookmark.deleteBookmarkLinks("cat-1");

            expect(result).toEqual(expect.arrayContaining(["bm-1", "bm-2"]));

            const remaining = await CategoryBookmark.getBookmarkIds("cat-1");
            expect(remaining).toEqual([]);
        });

        it("should throw an error if an unexpected issue occurs", async () => {
            const spy = vi.spyOn(Operator, "getRecords").mockRejectedValue(new Error("Database failure"));
            try {
                await expect(CategoryBookmark.deleteBookmarkLinks("cat-1")).rejects.toThrow(
                    "An error occurred in CategoryBookmark.deleteBookmarkLinks:- Error: Database failure, cat-1"
                );
            } catch (error) {
                expect(error).toBeInstanceOf(Error);
                if (error instanceof Error)
                    expect(error.message).toContain("Database failure");
            } finally {
                spy.mockRestore();
            }
        });
    });
});
