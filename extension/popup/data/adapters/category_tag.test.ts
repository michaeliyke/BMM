import { IDBKeyRange, indexedDB } from "fake-indexeddb";
import {
    afterAll,
    beforeAll,
    beforeEach,
    describe,
    expect,
    it,
    vi,
} from "vitest";
import { IBookmark, ICategory, ICategoryTag, ITag } from "../../utils/types/schemas";
import { Operator } from "../operator";
import Bookmark from "./bookmark";
import Category from "./category";
import CategoryTag from "./category_tag";
import Tag from "./tag";
globalThis.indexedDB = indexedDB;
globalThis.IDBKeyRange = IDBKeyRange;

describe("INTEGRATED TESTS FOR Category CLASS", async () => {
    let db: IDBDatabase;

    beforeAll(async () => {
        db = await Operator.initializeDatabase();
    });

    afterAll(() => {
        db.close();
        indexedDB.deleteDatabase("bmm");
    });

    describe("Method: categoryTag.create()", async () => {
        let categoryTag: CategoryTag;

        beforeEach(async () => {
            // Reset database state before each test
            await Operator.clearStore("category_tags");
            categoryTag = new CategoryTag({
                id: "ct1",
                category_id: "c1",
                tag_id: "t1"
            });
        });

        it("should create a new categoryTag successfully", async () => {
            const result = await categoryTag.create();
            expect(result).toEqual(categoryTag);
        });

        it("should return existing categoryTag if it already exists", async () => {
            await categoryTag.create(); // First creation
            const result = await categoryTag.create(); // Attempt duplicate
            expect(result).toEqual(categoryTag);
        });

        it("should throw an error if an unexpected failure occurs", async () => {
            const spy = vi.spyOn(Operator, "createRecord").mockRejectedValue(new Error("DB error"));
            try {
                await expect(categoryTag.create()).rejects.toThrow("An error occurred in CategoryTag.create");
            } catch (error) {
                expect(error).toBeInstanceOf(Error);
                if (error instanceof Error)
                    expect(error.message).toContain("DB error");
            } finally {
                spy.mockRestore();
            }
        });

        it("should throw an error if some fields are empty", async () => {
            try {
                new CategoryTag({ id: "", category_id: "c1", tag_id: "t1" });
            } catch (error) {
                expect(error).toBeInstanceOf(Error);
                if (error instanceof Error)
                    expect(error.message).toContain("required field");
            }
        });
    });

    describe("Method: categoryTag.getTags()", async () => {
        beforeEach(async () => {
            await Operator.clearStore("category_tags");
            await Operator.clearStore("tags");

            // Seed database with categories, tags, and categoryTags
            await Operator.createRecord("tags", { id: "t1", name: "Tag 1" });
            await Operator.createRecord("tags", { id: "t2", name: "Tag 2" });
            await Operator.createRecord("category_tags", { id: "ct1", category_id: "c1", tag_id: "t1" });
        });

        it("should return all tags linked to a category", async () => {
            setTimeout(async () => {
                const result = await CategoryTag.getTags("c1");
                expect(result).toEqual([{ id: "t1", name: "Tag 1" }]);
            }, 300);
        });

        it("should return an empty array if the category has no tags", async () => {
            setTimeout(async () => {
                const result = await CategoryTag.getTags("c2");
                expect(result).toEqual([]);
            }, 300);
        });

        it("should throw an error if an unexpected failure occurs", async () => {
            const spy = vi.spyOn(CategoryTag, "getAll").mockRejectedValue(new Error("DB error"));
            try {
                await expect(CategoryTag.getTags("c1")).rejects.toThrow("An error occurred in CategoryTag.getTags");
            } catch (error) {
                expect(error).toBeInstanceOf(Error);
                if (error instanceof Error)
                    expect(error.message).toContain("DB error");
            }
            finally {
                spy.mockRestore();
            }
        });
    });

    describe("Method: categoryTag.getCategories()", async () => {
        beforeEach(async () => {
            await Operator.clearStore("category_tags");
            await Operator.clearStore("categories");

            // Seed database with categories, tags, and categoryTags
            await Operator.createRecord("categories", { id: "c1", name: "Category 1" });
            await Operator.createRecord("categories", { id: "c2", name: "Category 2" });
            await Operator.createRecord("category_tags", { id: "ct1", category_id: "c1", tag_id: "t1" });
        });

        it("should return all categories linked to a tag", async () => {
            setTimeout(async () => {
                const result = await CategoryTag.getCategories("t1");
                expect(result).toEqual([{ id: "c1", name: "Category 1" }]);
            }, 300);
        });

        it("should return an empty array if the tag is not linked to any category", async () => {
            setTimeout(async () => {
                const result = await CategoryTag.getCategories("t2");
                expect(result).toEqual([]);
            }, 300);
        });

        it("should throw an error if an unexpected failure occurs", async () => {
            const spy = vi.spyOn(CategoryTag, "getAll").mockRejectedValue(new Error("DB error"));
            try {
                await expect(CategoryTag.getCategories("t1")).rejects.toThrow("An error occurred in CategoryTag.getCategories");
            } catch (error) {
                expect(error).toBeInstanceOf(Error);
                if (error instanceof Error)
                    expect(error.message).toContain("DB error");
            }
            finally {
                spy.mockRestore();
            }
        });
    });

    describe("Method: categoryTag.getAll()", async () => {
        beforeEach(async () => {
            await Operator.clearStore("category_tags");

            // Seed database with categoryTags
            await Operator.createRecord("category_tags", { id: "ct1", category_id: "c1", tag_id: "t1" });
            await Operator.createRecord("category_tags", { id: "ct2", category_id: "c2", tag_id: "t2" });
        });

        it("should return all categoryTags when no query is provided", async () => {
            setTimeout(async () => {
                const result = await CategoryTag.getAll();
                expect(result).toEqual([
                    { id: "ct1", category_id: "c1", tag_id: "t1" },
                    { id: "ct2", category_id: "c2", tag_id: "t2" }
                ]);
            }, 300);
        });

        it("should return filtered categoryTags when a query is provided", async () => {
            const query = IDBKeyRange.only(["c1", "t1"]); // [category_id, tag_id] pair
            const result = await CategoryTag.getAll(query);
            expect(result).toEqual([{ id: "ct1", category_id: "c1", tag_id: "t1" }]);
            expect(result).not.toContainEqual({ id: "ct2", category_id: "c2", tag_id: "t2" });
            expect(result).toHaveLength(1);
        });

        it("should return an empty array if no matching records are found", async () => {
            const query = IDBKeyRange.only(["c3", "t3"]); // Non-existing pair
            const result = await CategoryTag.getAll(query);
            expect(result).toEqual([]);
        });

        it("should throw an error if an unexpected failure occurs", async () => {
            const spy = vi.spyOn(Operator, "getRecordsByIndex").mockRejectedValue(new Error("DB error"));
            try {
                await expect(CategoryTag.getAll()).rejects.toThrow("An error occurred in CategoryTag.getAll");
            } catch (error) {
                expect(error).toBeInstanceOf(Error);
                if (error instanceof Error)
                    expect(error.message).toContain("DB error");
            } finally {
                spy.mockRestore();
            }
        });
    });

    describe("Mathod: CategoryTag.exists()", () => {
        const cat1: ICategory = {
            id: "c1", name: "Work",
            is_default: 0,
            created_at: (new Date()).toISOString(),
            updated_at: (new Date()).toISOString(),
            bookmarks: [],
            tags: []
        };
        const tag1: ITag = {
            id: "t1", name: "Urgent",
            created_at: (new Date()).toISOString(),
            updated_at: (new Date()).toISOString(),
        };
        const tg1: ICategoryTag = {
            category_id: "c1", tag_id: "t1",
            id: "ct1",
        };

        beforeEach(async () => {
            await Operator.clearStore("category_tags");

            // Seed database with categoryTags
            await Operator.createRecord("category_tags", { id: "ct1", category_id: "c1", tag_id: "t1" });
            await Operator.createRecord("category_tags", { id: "ct2", category_id: "c2", tag_id: "t2" });
        });

        it("should return category tag if found (static)", async () => {
            await expect(CategoryTag.exists("c1", "t1")).resolves.not.toBeNull();
        });

        it("should return category tag if found (instance)", async () => {
            setTimeout(async () => {
                const category = new Category(cat1);
                const tag = new Tag(tag1);
                const categoryTag = new CategoryTag(tg1);

                await category.create();
                await tag.create();
                await categoryTag.create();

                await expect(categoryTag.exists()).resolves.not.toBeNull();
            }, 300);
        });

        it("should return null if category tag is not found (static)", async () => {
            await expect(CategoryTag.exists("c1", "nonexistentTag")).resolves.toBeNull();
        });

        it("should return null if category tag is not found (instance)", async () => {
            const cT1: ICategoryTag = {
                category_id: "c1", tag_id: "nonexistentTag",
                id: "catTag1"
            };
            const categoryTag = new CategoryTag(cT1);

            await expect(categoryTag.exists()).resolves.toBeNull();
        });

        it("should throw an error if an unexpected failure occurs", async () => {
            vi.spyOn(Operator, "getRecordByIndex").mockRejectedValue(new Error("DB error"));

            await expect(CategoryTag.exists("c1", "t1"))
                .rejects.toThrow("An error occurred in CategoryTag.exists");
        });
    });

    describe("Mathod: CategoryTag.moveCategoryTag()", () => {
        it("should move a tag from one category to another", async () => {
            const cat1: ICategory = {
                id: "c1",
                name: "Work",
                is_default: 0,
                created_at: (new Date()).toISOString(),
                updated_at: (new Date()).toISOString(),
                bookmarks: [],
                tags: []
            };
            const cat2: ICategory = {
                id: "c2",
                name: "Personal",
                is_default: 0,
                created_at: (new Date()).toISOString(),
                updated_at: (new Date()).toISOString(),
                bookmarks: [],
                tags: []
            };
            const tg: ITag = {
                id: "t1",
                name: "Urgent",
                created_at: (new Date()).toISOString(),
                updated_at: (new Date()).toISOString(),
            };
            const catTag1: ICategoryTag = {
                category_id: "c1",
                tag_id: "t1",
                id: "ct1",
            };
            setTimeout(async () => {
                const category1 = new Category(cat1);
                const category2 = new Category(cat2);
                const tag = new Tag(tg);
                const categoryTag = new CategoryTag(catTag1);

                await category1.create();
                await category2.create();
                await tag.create();
                await categoryTag.create();

                await CategoryTag.moveCategoryTag("t1", "c1", "c2");

                await expect(CategoryTag.exists("c1", "t1")).resolves.toBeNull();
                await expect(CategoryTag.exists("c2", "t1")).resolves.not.toBeNull();
            }, 300);
        });

        it("should throw an error if an unexpected failure occurs", async () => {
            const spy = vi.spyOn(Operator, "updateRecord").mockRejectedValue(new Error("DB error"));
            try {
                await expect(CategoryTag.moveCategoryTag("t1", "c1", "c2"))
                    .rejects.toThrow("An error occurred in CategoryTag.moveCategoryTag");
            } catch (error) {
                expect(error).toBeInstanceOf(Error);
                if (error instanceof Error)
                    expect(error.message).toContain("DB error");
            }
            finally {
                spy.mockRestore();
            }
        });
    });

    describe("Mathod: CategoryTag.delete()", () => {
        it("should delete an existing category tag", async () => {
            const cat1: ICategory = {
                id: "c1",
                name: "Work",
                is_default: 0,
                created_at: (new Date()).toISOString(),
                updated_at: (new Date()).toISOString(),
                bookmarks: [],
                tags: []
            };

            const tg1: ITag = {
                id: "t1",
                name: "Urgent",
                created_at: (new Date()).toISOString(),
                updated_at: (new Date()).toISOString(),
            };

            const catTg1: ICategoryTag = {
                category_id: "c1",
                tag_id: "t1",
                id: "ct1",
            };

            const category = new Category(cat1);
            const tag = new Tag(tg1);
            const categoryTag = new CategoryTag(catTg1);

            setTimeout(async () => {
                await category.create();
                await tag.create();
                await categoryTag.create();

                await expect(categoryTag.exists()).resolves.not.toBeNull();

                await categoryTag.delete();
                await expect(categoryTag.exists()).resolves.toBeNull();
            }, 300);
        });

        it("should throw an error if an unexpected failure occurs", async () => {
            const catTg1: ICategoryTag = {
                category_id: "c1",
                tag_id: "t1",
                id: "ct1",
            };

            const categoryTag = new CategoryTag(catTg1);
            const spy = vi.spyOn(Operator, "deleteRecordsByIndex").mockRejectedValue(new Error("DB error"));
            try {
                await expect(categoryTag.delete()).rejects.toThrow("An error occurred in CategoryTag.delete");
            } catch (error) {
                expect(error).toBeInstanceOf(Error);
                if (error instanceof Error)
                    expect(error.message).toContain("DB error");
            }
            finally {
                spy.mockRestore();
            }
        });
    });

    describe("Mathod: CategoryTag.createBookmark()", () => {
        it("should create a bookmark when category and tag exist and are linked", async () => {
            const cat1: ICategory = {
                id: "c1",
                name: "Work",
                is_default: 0,
                created_at: (new Date()).toISOString(),
                updated_at: (new Date()).toISOString(),
                bookmarks: [],
                tags: []
            };

            const tg1: ITag = {
                id: "t1",
                name: "Urgent",
                created_at: (new Date()).toISOString(),
                updated_at: (new Date()).toISOString(),
            };

            const catTg1: ICategoryTag = {
                category_id: "c1",
                tag_id: "t1",
                id: "ct1",
            };

            const bk1: IBookmark = {
                id: "b1",
                url: "https://example.com",
                created_at: (new Date()).toISOString(),
                updated_at: (new Date()).toISOString(),
                title: "Example",
                description: "",
                tags: [],
                archived: 0
            };

            const category = new Category(cat1);
            const tag = new Tag(tg1);
            const categoryTag = new CategoryTag(catTg1);
            const bookmark = new Bookmark(bk1);

            setTimeout(async () => {
                await category.create();
                await tag.create();
                await categoryTag.create();

                const result = await CategoryTag.createBookmark(bookmark, category, tag);
                expect(result).toBeInstanceOf(Bookmark);
                expect(await bookmark.exists()).not.toBeNull();
            }, 300);
        });

        it("should throw an error if the category does not exist", async () => {
            const bk1: IBookmark = {
                id: "b1",
                url: "https://example.com",
                created_at: (new Date()).toISOString(),
                updated_at: (new Date()).toISOString(),
                title: "Example",
                description: "",
                tags: [],
                archived: 0
            };

            const cat1: ICategory = {
                id: "c1",
                name: "Work",
                is_default: 0,
                created_at: (new Date()).toISOString(),
                updated_at: (new Date()).toISOString(),
                bookmarks: [],
                tags: []
            };

            const tg1: ITag = {
                id: "t1",
                name: "Important",
                created_at: (new Date()).toISOString(),
                updated_at: (new Date()).toISOString(),
            };

            const bookmark = new Bookmark(bk1);
            const category = new Category(cat1);
            const tag = new Tag(tg1);

            setTimeout(async () => {
                await expect(CategoryTag.createBookmark(bookmark, category, tag))
                    .rejects.toThrow("CategoryTag.createBookmark:- Category not found");
            }, 300);
        });

        it("should throw an error if an unexpected failure occurs", async () => {
            const catTag1: ICategoryTag = {
                category_id: "c1",
                tag_id: "t1",
                id: "ct1",
            };
            const categoryTag = new CategoryTag(catTag1);

            vi.spyOn(Operator, "createRecord").mockRejectedValue(new Error("DB error"));
            await expect(categoryTag.create()).rejects.toThrow("An error occurred in CategoryTag.create");
        });
    });
});
