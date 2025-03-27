import adapters from '../data/adapters';
import Bookmark from "../data/adapters/bookmark";
import Category from "../data/adapters/category";
import Tag from "../data/adapters/tag";
import { IBookmark, ICategory, ITag } from './types/schemas';

import { afterEach, describe, expect, it, vi } from 'vitest';
import * as importExport from './importExport';

const importExport2 = {
    importCategoriesHandler: vi.fn(),
    importBookmarksHandler: vi.fn(),
    validateImported: vi.fn(),
    isCategoryArray: vi.fn(),
    getImportHandler: vi.fn(),
    markBookmarkExists: vi.fn(),
};

describe("Tests For importExport utils", () => {
    afterEach(() => vi.resetAllMocks());
    describe("importCategoriesHandler()", () => {
        it("should call adapters.loadBulkData with categories", async () => {
            const categories: ICategory[] = [{
                id: "1", name: "Category 1", bookmarks: [], tags: [],
                is_default: 0,
                created_at: (new Date()).toISOString(),
                updated_at: (new Date()).toISOString(),
            }];
            const setData = vi.fn();
            const handler = importExport.importCategoriesHandler(categories, setData);

            adapters.loadBulkData = vi.fn().mockResolvedValue(undefined);

            await handler();

            expect(adapters.loadBulkData).toHaveBeenCalledWith(categories);
        });

        it("should update state with new categories", async () => {
            const categories: ICategory[] = [{
                id: "1", name: "Category 1", bookmarks: [], tags: [],
                is_default: 0,
                created_at: (new Date()).toISOString(),
                updated_at: (new Date()).toISOString(),
            }];
            const setData = vi.fn();
            const handler = importExport.importCategoriesHandler(categories, setData);

            adapters.loadBulkData = vi.fn().mockResolvedValue(undefined);

            await handler();

            expect(setData).toHaveBeenCalledWith(expect.any(Function));

            const updateFunction = setData.mock.calls[0][0];
            const prevData: ICategory[] = [{
                id: "2", name: "Category 2", bookmarks: [], tags: [],
                is_default: 0,
                created_at: (new Date()).toISOString(),
                updated_at: (new Date()).toISOString(),
            }];
            const newData = updateFunction(prevData);

            expect(newData).toEqual([...prevData, ...categories]);
        });
    });

    describe("importBookmarksHandler()", () => {
        it("should call adapters.loadBulkBookmarks with bookmarks", async () => {
            const bookmarks: IBookmark[] = [{
                id: "1", title: "Bookmark 1", url: "http://example.com", tags: [],
                created_at: (new Date()).toISOString(),
                updated_at: (new Date()).toISOString(),
                description: '',
                archived: 0
            }];
            const setData = vi.fn();
            const handler = importExport.importBookmarksHandler(bookmarks, setData);

            adapters.loadBulkBookmarks = vi.fn().mockResolvedValue(undefined);

            await handler();

            expect(adapters.loadBulkBookmarks).toHaveBeenCalledWith(bookmarks);
        });

        it("should update state with new bookmarks in default category", async () => {
            const bookmarks: IBookmark[] = [{
                id: "1", title: "Bookmark 1", url: "http://example.com", tags: [],
                created_at: (new Date()).toISOString(),
                updated_at: (new Date()).toISOString(),
                description: '',
                archived: 0
            }];
            const setData = vi.fn();
            const handler = importExport.importBookmarksHandler(bookmarks, setData);

            adapters.loadBulkBookmarks = vi.fn().mockResolvedValue(undefined);

            await handler();

            expect(setData).toHaveBeenCalledWith(expect.any(Function));

            const updateFunction = setData.mock.calls[0][0];
            const prevData: ICategory[] = [{
                id: "default", name: "Default Category", bookmarks: [], tags: [],
                is_default: 1,
                created_at: (new Date()).toISOString(),
                updated_at: (new Date()).toISOString(),
            }];
            const newData = updateFunction(prevData);

            // Expect the new data to contain the old data with the new bookmarks
            expect(newData).toEqual(expect.arrayContaining([
                expect.objectContaining({
                    id: "default",
                    bookmarks: expect.arrayContaining(bookmarks),
                })
            ]));

            expect(setData).toHaveBeenCalledTimes(1);
            expect(typeof setData.mock.calls[0][0]).toBe('function');
        });

        it("should not update state if no default category exists", async () => {
            const bookmarks: IBookmark[] = [{
                id: "1", title: "Bookmark 1", url: "http://example.com", tags: [],
                created_at: (new Date()).toISOString(),
                updated_at: (new Date()).toISOString(),
                description: '',
                archived: 0
            }];
            const setData = vi.fn();
            const handler = importExport.importBookmarksHandler(bookmarks, setData);

            adapters.loadBulkBookmarks = vi.fn().mockResolvedValue(undefined);

            await handler();

            expect(setData).toHaveBeenCalledWith(expect.any(Function));

            const updateFunction = setData.mock.calls[0][0];
            const prevData: ICategory[] = [{
                id: "2", name: "Category 2", bookmarks: [], tags: [],
                is_default: 0,
                created_at: (new Date()).toISOString(),
                updated_at: (new Date()).toISOString(),
            }];
            const newData = updateFunction(prevData);

            expect(newData).toEqual(prevData);
        });
    });

    describe("validateImported", () => {
        const categories: ICategory[] = [
            {
                id: "category1",
                name: "Category 1",
                importType: "category",
                bookmarks: [
                    {
                        id: "bookmark1",
                        url: "https://example.com",
                        title: "Example",
                        importType: "bookmark",
                        tags: [
                            {
                                id: "tag1", name: "Tag 1",
                                created_at: '',
                                updated_at: ''
                            },
                            {
                                id: "tag2", name: "Tag 2",
                                created_at: '',
                                updated_at: ''
                            }
                        ],
                        description: '',
                        created_at: '',
                        updated_at: '',
                        archived: 0
                    },
                    {
                        id: "bookmark2",
                        url: "https://example2.com",
                        title: "Example 2",
                        importType: "bookmark",
                        tags: [],
                        description: '',
                        created_at: '',
                        updated_at: '',
                        archived: 0
                    }
                ],
                tags: [
                    {
                        id: "tag1", name: "Tag 1",
                        created_at: '',
                        updated_at: ''
                    },
                    {
                        id: "tag3", name: "Tag 3",
                        created_at: '',
                        updated_at: ''
                    }
                ],
                is_default: 0,
                created_at: '',
                updated_at: ''
            }
        ];

        it("should mark importExists as true when the resource exists in the db", async () => {
            // Mock the exists function to return true for specific IDs
            vi.spyOn(Category, 'exists').mockResolvedValue({} as ICategory);
            vi.spyOn(Bookmark, 'exists').mockResolvedValue({} as IBookmark);
            vi.spyOn(Tag, 'exists').mockResolvedValue({} as ITag);

            await importExport.validateImported(categories);

            // Loop through all and ensure that the importExists property is set to true
            for (const category of categories) {
                expect(category.importExists).toBe(true);
                for (const bookmark of category.bookmarks) {
                    expect(bookmark.importExists).toBe(true);
                    for (const tag of bookmark.tags) {
                        expect(tag.importExists).toBe(true);
                    }
                }
            }

            // Very that exists was called with correct ids
            expect(Category.exists).toHaveBeenCalledWith("category1");
            expect(Bookmark.exists).toHaveBeenCalledWith("bookmark1");
            expect(Bookmark.exists).toHaveBeenCalledWith("bookmark2");
            expect(Tag.exists).toHaveBeenCalledWith("tag1");
            expect(Tag.exists).toHaveBeenCalledWith("tag2");
            expect(Tag.exists).toHaveBeenCalledWith("tag3");
        });

        it("should mark importExists as false when the resource does not exists in the db", async () => {
            // Mock the exists function to return true for specific IDs
            vi.spyOn(Category, 'exists').mockResolvedValue(null);
            vi.spyOn(Bookmark, 'exists').mockResolvedValue(null);
            vi.spyOn(Tag, 'exists').mockResolvedValue(null);

            await importExport.validateImported(categories);

            // Loop through all and ensure that the importExists property is set to true
            for (const category of categories) {
                expect(category.importExists).toBe(false);
                for (const bookmark of category.bookmarks) {
                    expect(bookmark.importExists).toBe(false);
                    for (const tag of bookmark.tags) {
                        expect(tag.importExists).toBe(false);
                    }
                }
            }

            // Very that exists was called with correct ids
            expect(Category.exists).toHaveBeenCalledWith("category1");
            expect(Bookmark.exists).toHaveBeenCalledWith("bookmark1");
            expect(Bookmark.exists).toHaveBeenCalledWith("bookmark2");
            expect(Tag.exists).toHaveBeenCalledWith("tag1");
            expect(Tag.exists).toHaveBeenCalledWith("tag2");
            expect(Tag.exists).toHaveBeenCalledWith("tag3");
        });
    });

    describe("isCategoryArray", () => {
        it("should return true for an array of category objects", () => {
            const categories: ICategory[] = [
                {
                    id: "1",
                    name: "Category 1",
                    importType: "category",
                    bookmarks: [],
                    tags: [],
                    is_default: 0,
                    created_at: '',
                    updated_at: ''
                },
                {
                    id: "2",
                    name: "Category 2",
                    importType: "category",
                    bookmarks: [],
                    tags: [],
                    is_default: 0,
                    created_at: '',
                    updated_at: ''
                }
            ];

            expect(importExport.isCategoryArray(categories)).toBe(true);
        });

        it("should return false for an array containing non-category objects", () => {
            const mixedArray = [
                {
                    id: "1",
                    name: "Category 1",
                    importType: "category",
                    bookmarks: [],
                    tags: [],
                    is_default: 0,
                    created_at: '',
                    updated_at: ''
                },
                {
                    id: "1",
                    title: "Bookmark 1",
                    url: "http://example.com",
                    importType: "bookmark",
                    tags: [],
                    description: '',
                    created_at: '',
                    updated_at: '',
                    archived: 0
                }
            ];

            expect(importExport.isCategoryArray(mixedArray as ICategory[])).toBe(false);
        });

        it("should return false for an array of bookmark objects", () => {
            const bookmarks: any = [
                {
                    id: "1",
                    title: "Bookmark 1",
                    url: "http://example.com",
                    importType: "bookmark",
                    tags: [],
                    description: '',
                    created_at: '',
                    updated_at: '',
                    archived: 0
                }
            ];

            expect(importExport.isCategoryArray(bookmarks as ICategory[])).toBe(false);
        });

        it("should return false for items without importType", () => {
            const invalidItems = [
                {
                    id: "1",
                    name: "Category 1",
                    bookmarks: [],
                    tags: [],
                    is_default: 0,
                    created_at: '',
                    updated_at: ''
                }
            ];

            expect(importExport.isCategoryArray(invalidItems)).toBe(false);
        });
    });

    describe("isImportData", () => {
        it("should return true for valid array of categories", () => {
            const categories = [
                {
                    id: "1",
                    name: "Category 1",
                    importType: "category",
                    bookmarks: [],
                    tags: [],
                    is_default: 0,
                    created_at: '',
                    updated_at: ''
                }
            ];

            expect(importExport.isImportData(categories)).toBe(true);
        });

        it("should return true for valid array of bookmarks", () => {
            const bookmarks = [
                {
                    id: "1",
                    title: "Bookmark 1",
                    url: "http://example.com",
                    importType: "bookmark",
                    tags: [],
                    description: '',
                    created_at: '',
                    updated_at: '',
                    archived: 0
                }
            ];

            expect(importExport.isImportData(bookmarks)).toBe(true);
        });

        it("should return false for empty arrays", () => {
            expect(importExport.isImportData([])).toBe(false);
        });

        it("should return false for non-array inputs", () => {
            expect(importExport.isImportData("not an array")).toBe(false);
            expect(importExport.isImportData(123)).toBe(false);
            expect(importExport.isImportData(null)).toBe(false);
            expect(importExport.isImportData(undefined)).toBe(false);
            expect(importExport.isImportData({})).toBe(false);
        });

        it("should return false if any item has invalid importType", () => {
            const invalidData = [
                {
                    id: "1",
                    title: "Something",
                    importType: "invalid"
                }
            ];

            expect(importExport.isImportData(invalidData)).toBe(false);
        });

        it("should return false if any item lacks importType", () => {
            const invalidData = [
                {
                    id: "1",
                    name: "Category 1",
                    bookmarks: [],
                    tags: []
                }
            ];

            expect(importExport.isImportData(invalidData)).toBe(false);
        });
    });

    describe.skip("getImportHandler", () => {
        it("should call importCategoriesHandler when data is a category array", () => {
            const categories: ICategory[] = [
                { id: "1", name: "Category 1", importType: "category", bookmarks: [], tags: [], is_default: 0, created_at: '', updated_at: '' }
            ];
            const setData = vi.fn();

            // Spy on the actual function
            const importCategoriesHandlerSpy = vi.spyOn(importExport, "importCategoriesHandler");

            importExport.getImportHandler(categories, setData);

            expect(importCategoriesHandlerSpy).toHaveBeenCalledWith(categories, setData);
        });

        it("should call importBookmarksHandler when data is a bookmarks array", () => {
            const bookmarks: IBookmark[] = [
                { id: "1", title: "Bookmark 1", url: "http://example.com", importType: "bookmark", tags: [], description: '', created_at: '', updated_at: '', archived: 0 }
            ];
            const setData = vi.fn();

            // Spy on the actual function
            const importBookmarksHandlerSpy = vi.spyOn(importExport2, "importBookmarksHandler");

            importExport.getImportHandler(bookmarks, setData);

            expect(importBookmarksHandlerSpy).toHaveBeenCalledWith(bookmarks, setData);
        });
    });

    describe("markBookmarkExists", () => {
        afterEach(() => vi.resetAllMocks());
        it("should mark bookmarks and their tags as existing when they exist in the database", async () => {
            const bookmarks: IBookmark[] = [
                {
                    id: "bookmark1",
                    url: "https://example.com",
                    title: "Example",
                    tags: [
                        {
                            id: "tag1", name: "Tag 1",
                            created_at: '',
                            updated_at: ''
                        },
                        {
                            id: "tag2", name: "Tag 2",
                            created_at: '',
                            updated_at: ''
                        }
                    ],
                    description: '',
                    created_at: '',
                    updated_at: '',
                    archived: 0
                },
                {
                    id: "bookmark2",
                    url: "https://example2.com",
                    title: "Example 2",
                    tags: [],
                    description: '',
                    created_at: '',
                    updated_at: '',
                    archived: 0
                }];

            // Mock the exists functions to return true (resource exists)
            vi.spyOn(Bookmark, 'exists').mockResolvedValue({} as IBookmark);
            vi.spyOn(Tag, 'exists').mockResolvedValue({} as ITag);

            // Call the function
            await importExport.markBookmarkExists(bookmarks);

            // Verify all bookmarks and tags are marked as existing
            for (const bookmark of bookmarks) {
                expect(bookmark.importExists).toBe(true);
                for (const tag of bookmark.tags) {
                    expect(tag.importExists).toBe(true);
                }
            }

            // Verify that exists was called with correct bookmark ids
            expect(Bookmark.exists).toHaveBeenCalledWith("bookmark1");
            expect(Bookmark.exists).toHaveBeenCalledWith("bookmark2");
            // Verify that exists was called with correct tag ids
            expect(Tag.exists).toHaveBeenCalledWith("tag1");
            expect(Tag.exists).toHaveBeenCalledWith("tag2");
        });

        it("should mark bookmarks and their tags as non-existing when they don't exist in the database", async () => {
            // Test data
            const bookmarks: IBookmark[] = [
                {
                    id: "bookmark1",
                    url: "https://example.com",
                    title: "Example",
                    tags: [
                        {
                            id: "tag1", name: "Tag 1",
                            created_at: '',
                            updated_at: ''
                        }
                    ],
                    description: '',
                    created_at: '',
                    updated_at: '',
                    archived: 0
                }];

            // Mock the exists functions to return null (resource doesn't exist)
            vi.spyOn(Bookmark, 'exists').mockResolvedValue(null);
            vi.spyOn(Tag, 'exists').mockResolvedValue(null);

            // Call the function
            await importExport.markBookmarkExists(bookmarks);

            // Verify all bookmarks and tags are marked as non-existing
            for (const bookmark of bookmarks) {
                expect(bookmark.importExists).toBe(false);
                for (const tag of bookmark.tags) {
                    expect(tag.importExists).toBe(false);
                }
            }

            // Verify that exists was called with correct ids
            expect(Bookmark.exists).toHaveBeenCalledWith("bookmark1");
            expect(Tag.exists).toHaveBeenCalledWith("tag1");
        });

        it("should handle mixed existence states for bookmarks and tags", async () => {
            // Test data
            const bookmarks: IBookmark[] = [{
                id: "bookmark1",
                url: "https://example.com",
                title: "Example",
                tags: [
                    {
                        id: "tag1", name: "Tag 1",
                        created_at: '',
                        updated_at: ''
                    },
                    {
                        id: "tag2", name: "Tag 2",
                        created_at: '',
                        updated_at: ''
                    }
                ],
                description: '',
                created_at: '',
                updated_at: '',
                archived: 0
            }];

            // Mock for different results based on id
            vi.spyOn(Bookmark, 'exists').mockImplementation(async (id) => {
                if (id === "bookmark1") return {} as IBookmark;
                return null;
            });

            vi.spyOn(Tag, 'exists').mockImplementation(async (id) => {
                if (id === "tag1") return {} as ITag;
                return null;
            });

            // Call the function
            await importExport.markBookmarkExists(bookmarks);

            // Verify the bookmark exists
            expect(bookmarks[0].importExists).toBe(true);
            // First tag exists, second doesn't
            expect(bookmarks[0].tags[0].importExists).toBe(true);
            expect(bookmarks[0].tags[1].importExists).toBe(false);
        });
    });
});
