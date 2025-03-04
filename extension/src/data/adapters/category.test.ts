import { IDBKeyRange, indexedDB } from "fake-indexeddb";
import {
    afterAll,
    beforeAll,
    beforeEach,
    describe,
    expect,
    it,
    test,
    vi
} from "vitest";
import { IBookmark, ICategory, ITag } from "../../utils/types/schemas";
import { Operator } from "../operator";
import Bookmark from "./bookmark";
import BookmarkTag from "./bookmark_tag";
import Category from "./category";
import CategoryBookmark from "./category_bookmark";
import CategoryTag from "./category_tag";
import Tag from "./tag";
globalThis.indexedDB = indexedDB;
globalThis.IDBKeyRange = IDBKeyRange;

describe("INTEGRATED TESTS FOR Category CLASS", () => {
    let db: IDBDatabase;

    beforeAll(async () => {
        db = await Operator.initializeDatabase();
    });

    afterAll(() => {
        db.close();
        indexedDB.deleteDatabase("bmm");
    });

    describe("Method: category.create()", () => {
        beforeEach(async () => {
            await Operator.clearStore("categories"); // Ensure a clean state before each test
        });

        it("should create a new category if it does not exist", async () => {
            const categoryData = {
                id: "123",
                name: "Work",
                is_default: 0,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                bookmarks: [{ id: "b1", title: "Example", url: "https://example.com", description: "", created_at: "", updated_at: "", tags: [], archived: 0 }],
                tags: [{ id: "t1", name: "Important", created_at: "", updated_at: "" }]
            };

            const category = new Category(categoryData);
            const createdCategory = await category.create();

            expect(createdCategory).toMatchObject({
                id: categoryData.id,
                name: categoryData.name,
                is_default: categoryData.is_default,
                bookmarks: [], // Should be empty since it's not stored
                tags: [] // Should be empty since it's not stored
            });
        });

        it("should return an existing category instead of creating a duplicate", async () => {
            const categoryData = {
                id: "456",
                name: "Personal",
                is_default: 1,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                bookmarks: [],
                tags: []
            };

            const category = new Category(categoryData);
            await category.create(); // First creation
            const duplicateCategory = await category.create(); // Attempt duplicate creation

            expect(duplicateCategory.id).toBe(categoryData.id); // Should return the existing category
        });

        it("should throw an error if category creation fails", async () => {
            const categoryData = {
                id: "",
                name: "Invalid",
                is_default: 0,
                created_at: "",
                updated_at: "",
                bookmarks: [],
                tags: []
            };
            try {
                const category = new Category(categoryData as ICategory);
                await expect(category.create()).rejects.toThrow("An error occurred in Category.create");
            } catch (error) {
                if (error instanceof Error) {
                    expect(error.message).toContain(`Category.constructor: required field:`);
                } else {
                    throw error;
                }
            }
        });
    });

    describe("Method: category.update()", () => {
        beforeEach(async () => {
            await Operator.clearStore("categories");
        });

        it("should update an existing category", async () => {
            const categoryData = {
                id: "123",
                name: "Work",
                is_default: 0,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                bookmarks: [],
                tags: []
            };

            const category = new Category(categoryData);
            await category.create();

            category.name = "Updated Work";
            setTimeout(async () => {
                await category.update();
                const updatedCategory = await Category.getCategoryById(category.id);
                expect(updatedCategory?.name).toBe("Updated Work");
            }, 300);
        });

        it("should throw an error if the category does not exist", async () => {
            const categoryData = {
                id: "456",
                name: "Nonexistent",
                is_default: 0,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                bookmarks: [],
                tags: []
            };

            const category = new Category(categoryData);
            await expect(category.update()).rejects.toThrow(
                /Category.update: Category does not exist/
            );
        });
    });

    describe("Method: category.exists() - both instance and static", () => {
        beforeEach(async () => {
            await Operator.clearStore("categories");
        });

        it("should return the category if it exists (instance)", async () => {
            const categoryData = {
                id: "456",
                name: "Personal",
                is_default: 1,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                bookmarks: [],
                tags: []
            };

            const category = new Category(categoryData);
            await category.create();

            const existingCategory = await category.exists();
            expect(existingCategory).toBeDefined();
            expect(existingCategory?.id).toBe("456");
        });

        it("should return the category if it exists (static)", async () => {
            const categoryData = {
                id: "456",
                name: "Personal",
                is_default: 1,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                bookmarks: [],
                tags: []
            };

            const category = new Category(categoryData);
            await category.create();

            const existingCategory = await Category.exists(category.name);
            expect(existingCategory).toBeDefined();
            expect(existingCategory?.id).toBe("456");
        });

        it("should return null if the category does not exist (instance)", async () => {
            const category = new Category({
                id: "999",
                name: "Nonexistent",
                is_default: 0,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                bookmarks: [],
                tags: []
            });

            const result = await category.exists();
            expect(result).toBeNull();
        });
        it("should return null if the category does not exist (static)", async () => {
            const category = new Category({
                id: "999",
                name: "Nonexistent",
                is_default: 0,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                bookmarks: [],
                tags: []
            });

            const result = await Category.exists(category.name);
            expect(result).toBeNull();
        });
    });


    describe("Method: category.getCategories()", () => {
        it("should return an array of categories when categories exist", async () => {
            const category1 = new Category({
                id: "1",
                name: "Work",
                is_default: 0,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                bookmarks: [],
                tags: []
            });
            const category2 = new Category({
                id: "2",
                name: "Leisure",
                is_default: 0,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                bookmarks: [],
                tags: []
            });

            await category1.create();
            await category2.create();

            const result = await Category.getCategories();
            expect(result).toBeInstanceOf(Array);
            expect(result.length).toBeGreaterThanOrEqual(2);
        });

        it("should return an empty array when no categories exist", async () => {
            indexedDB.deleteDatabase("bmm"); // Clear the database
            await Operator.initializeDatabase();
            setTimeout(async () => {
                const result = await Category.getCategories();
                expect(result).toEqual([]);
            }, 300);
        });

        it("should throw an error if an exception occurs", async () => {
            vi.spyOn(Operator, "getRecords").mockRejectedValue(new Error("DB error"));

            await expect(Category.getCategories()).rejects.toThrow(
                "An error occurred in Category.getCategories"
            );

            vi.restoreAllMocks();
        });
    });

    describe("Method: category.getCategoryByName()", () => {
        it("should return the category when it exists", async () => {
            const category = new Category({
                id: "1",
                name: "Work",
                is_default: 0,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                bookmarks: [],
                tags: []
            });
            await category.create();

            const result = await Category.getCategoryByName("Work");
            expect(result).toBeDefined();
            expect(result?.name).toBe("Work");
        });

        it("should return null when the category does not exist", async () => {
            const result = await Category.getCategoryByName("Nonexistent");
            expect(result).toBeNull();
        });

        it("should throw an error if an exception occurs", async () => {
            vi.spyOn(Operator, "getRecordByIndex").mockRejectedValue(new Error("DB error"));

            await expect(Category.getCategoryByName("Work")).rejects.toThrow(
                "An error occurred in Category.getCategoryById"
            );

            vi.restoreAllMocks();
        });
    });

    describe("Method: category.getCategoryById()", () => {
        it("should return the category when it exists", async () => {
            const category = new Category({
                id: "123",
                name: "Personal",
                is_default: 0,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                bookmarks: [],
                tags: []
            });
            await category.create();

            const result = await Category.getCategoryById("123");
            expect(result).toBeDefined();
            expect(result?.id).toBe("123");
        });

        it("should return null when the category does not exist", async () => {
            const result = await Category.getCategoryById("999");
            expect(result).toBeNull();
        });

        it("should throw an error if an exception occurs", async () => {
            vi.spyOn(Operator, "getRecordById").mockRejectedValue(new Error("DB error"));

            await expect(Category.getCategoryById("123")).rejects.toThrow(
                "An error occurred in Category.getCategoryById"
            );

            vi.restoreAllMocks();
        });
    });

    describe('Category.getAll()', () => {
        beforeAll(async () => {
            indexedDB.deleteDatabase('bmm');
            Operator.initializeDatabase();
            // Seed test data
            const cWork: ICategory = {
                id: 'cat1', name: 'Work',
                is_default: 0,
                created_at: (new Date()).toISOString(),
                updated_at: (new Date()).toISOString(),
                bookmarks: [],
                tags: []
            };
            const bGoogle: IBookmark = {
                id: 'bm1', title: 'Google', url: 'https://google.com',
                description: "",
                created_at: (new Date()).toISOString(),
                updated_at: (new Date()).toISOString(),
                tags: [],
                archived: 0
            };
            const bGithub: IBookmark = {
                id: 'bm2', title: 'GitHub', url: 'https://github.com',
                description: "",
                created_at: (new Date()).toISOString(),
                updated_at: (new Date()).toISOString(),
                tags: [],
                archived: 0
            };
            const tSearch: ITag = {
                id: 'tag1', name: 'Search',
                created_at: (new Date()).toISOString(),
                updated_at: (new Date()).toISOString(),
            };
            const tCode: ITag = {
                id: 'tag2', name: 'Code',
                created_at: (new Date()).toISOString(),
                updated_at: (new Date()).toISOString(),
            };

            const cBWorkGoogle = { id: 'cb1', category_id: 'cat1', bookmark_id: 'bm1' };
            const cBWorkGithub = { id: 'cb2', category_id: 'cat1', bookmark_id: 'bm2' };
            const cTWorkSearch = { id: 'ct1', category_id: 'cat1', tag_id: 'tag1' };
            const bTGoogleSearch = { id: 'bt1', bookmark_id: 'bm1', tag_id: 'tag1' };
            const bTGithubCode = { id: 'bt2', bookmark_id: 'bm2', tag_id: 'tag2' };

            await new Category(cWork).create(); // create a category
            await new Bookmark(bGoogle).create();
            await new Bookmark(bGithub).create(); // create 2 bookmarks
            await new Tag(tSearch).create();
            await new Tag(tCode).create(); // create 2 tags

            // Relationships
            await new CategoryBookmark(cBWorkGoogle).create();
            await new CategoryBookmark(cBWorkGithub).create(); // Link: category -> bookmarks 1 & 2
            await new CategoryTag(cTWorkSearch).create(); // Link: category -> tag 1
            await new BookmarkTag(bTGoogleSearch).create(); // Link: bookmark 1 -> tag 1
            await new BookmarkTag(bTGithubCode).create(); // Link: bookmark 2 -> tag 2

            /*
            NOTE: The following relationships are established:
            We have a category 'Work' with 2 bookmarks: 'Google' and 'GitHub'.
            Work has a tag 'Search'
            Google has a tag 'Search'
            GitHub has a tag 'Code'
            */
        });

        afterAll(async () => {
            await db.close();
        });

        test('should retrieve all categories with bookmarks and tags', async () => {
            const categories: ICategory[] = await Category.getAll();
            setTimeout(() => {
                expect(categories).toHaveLength(1);

                const [work] = categories;
                expect(work.id).toBe('cat1');
                expect(work.bookmarks).toHaveLength(2);
                expect(work.tags).toHaveLength(1);

                const google = work.bookmarks.find(b => b.id === 'bm1');
                const github = work.bookmarks.find(b => b.id === 'bm2');
                expect(google).toBeDefined();
                expect(github).toBeDefined();

                expect(google?.tags).toHaveLength(1);
                expect(google?.tags[0].id).toBe('tag1');

                expect(github?.tags).toHaveLength(1);
                expect(github?.tags[0].id).toBe('tag2');
            }, 300);
        });
    });
});
