import {
    afterAll,
    beforeAll,
    beforeEach,
    describe,
    expect,
    it,
    vi
} from "vitest";
import { IBookmark } from "../../utils/types/schemas";
import { Operator } from "../operator";
import Bookmark from "./bookmark";

import { indexedDB } from "fake-indexeddb";

globalThis.indexedDB = indexedDB;

describe("INTEGRATED TESTS FOR Bookmark CLASS", async () => {
    let db: IDBDatabase;

    beforeAll(async () => {
        db = await Operator.initializeDatabase();
    });

    afterAll(() => {
        db.close();
        indexedDB.deleteDatabase("bmm");
    });

    beforeEach(() => {
        // Clear the bookmarks store before each test
        Operator.clearStore("bookmarks");
    });

    describe("Method: bookmark.create()", () => {
        it("should create a new bookmark if it does not exist", async () => {
            const bookmarkData: IBookmark = {
                id: "1",
                title: "Test Bookmark",
                url: "https://example.com",
                description: "A test bookmark",
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                tags: [],
                archived: 0,
                starred: 0,
            };

            const bookmark = new Bookmark(bookmarkData);
            const createdBookmark = await bookmark.create();

            expect(createdBookmark).toMatchObject(bookmarkData);
        });

        it("should return an existing bookmark if already present", async () => {
            const bookmarkData: IBookmark = {
                id: "1",
                title: "Test Bookmark",
                url: "https://example.com",
                description: "A test bookmark",
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                tags: [],
                archived: 0,
                starred: 0,
            };

            const bookmark = new Bookmark(bookmarkData);
            await bookmark.create(); // First time creation
            const existingBookmark = await bookmark.create(); // Should return the same bookmark

            expect(existingBookmark.id).toEqual(bookmarkData.id);
        });

        it("should handle errors properly", async () => {
            vi.spyOn(Operator, "createRecord").mockRejectedValue(new Error("DB error"));

            const bookmarkData: IBookmark = {
                id: "2",
                title: "Error Bookmark",
                url: "https://error.com",
                description: "A test bookmark with error",
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                tags: [],
                archived: 0,
                starred: 0,
            };

            const bookmark = new Bookmark(bookmarkData);

            await expect(bookmark.create()).rejects.toThrow(
                /An error occurred in Bookmark.create/
            );

            vi.restoreAllMocks();
        });
    });

    describe("Method: bookmark.update()", () => {
        it("should update an existing bookmark", async () => {
            const bookmarkData: IBookmark = {
                id: "3",
                title: "Old Title",
                url: "https://example.com",
                description: "A test bookmark",
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                tags: [],
                archived: 0,
                starred: 0,
            };

            const bookmark = new Bookmark(bookmarkData);
            await bookmark.create();

            bookmark.title = "Updated Title";
            await bookmark.update();

            const updatedBookmark = await Operator.getRecordById<IBookmark>('bookmarks', bookmark.id);
            expect(updatedBookmark?.title).toBe("Updated Title");
        });

        it("should throw an error if the bookmark does not exist", async () => {
            const bookmarkData: IBookmark = {
                id: "4",
                title: "Non-Existent",
                url: "https://example.com",
                description: "A test bookmark",
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                tags: [],
                archived: 0,
                starred: 0,
            };

            const bookmark = new Bookmark(bookmarkData);

            await expect(bookmark.update()).rejects.toThrow(
                /Bookmark.update: Bookmark does not exist/
            );
        });

        it("should handle errors properly", async () => {
            vi.spyOn(Operator, "updateRecord").mockRejectedValue(new Error("DB error"));

            const bookmarkData: IBookmark = {
                id: "5",
                title: "Error Bookmark",
                url: "https://error.com",
                description: "A test bookmark with error",
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                tags: [],
                archived: 0,
                starred: 0,
            };

            const bookmark = new Bookmark(bookmarkData);
            await bookmark.create();

            await expect(bookmark.update()).rejects.toThrow(
                /An error occurred in Bookmark.update/
            );

            vi.restoreAllMocks();
        });
    });

    describe("Method: bookmark.delete()", () => {
        // TODO: To be upgraded later to handle cases of disassociation

        it("should delete an existing bookmark", async () => {
            const bookmarkData: IBookmark = {
                id: "6",
                title: "Delete Me",
                url: "https://example.com",
                description: "A test bookmark",
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                tags: [],
                archived: 0,
                starred: 0,
            };

            const bookmark = new Bookmark(bookmarkData);
            await bookmark.create();

            await bookmark.delete();
            setTimeout(async () => {
                const deletedBookmark = await bookmark.exists();
                expect(deletedBookmark).toBeNull();
            }, 100);
        });

        it("should throw an error if the bookmark does not exist", async () => {
            const bookmarkData: IBookmark = {
                id: "7",
                title: "Non-Existent",
                url: "https://example.com",
                description: "A test bookmark",
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                tags: [],
                archived: 0,
                starred: 0,
            };

            const bookmark = new Bookmark(bookmarkData);
            await expect(bookmark.delete()).rejects.toThrow(
                /Bookmark.delete:- Bookmark not found/
            );
        });

        it("should handle errors properly", async () => {
            vi.spyOn(Operator, "deleteRecord").mockRejectedValue(new Error("DB error"));

            const bookmarkData: IBookmark = {
                id: "8",
                title: "Error Bookmark",
                url: "https://error.com",
                description: "A test bookmark with error",
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                tags: [],
                archived: 0,
                starred: 0,
            };

            const bookmark = new Bookmark(bookmarkData);
            await bookmark.create();

            await expect(bookmark.delete()).rejects.toThrow(
                /An error occurred in Bookmark.delete/
            );

            vi.restoreAllMocks();
        });
    });

    describe("Method: bookmark.exists()", () => {
        it("should return a bookmark if it exists (static method)", async () => {
            const bookmarkData: IBookmark = {
                id: "9",
                title: "Existing Bookmark",
                url: "https://example.com",
                description: "A test bookmark",
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                tags: [],
                archived: 0,
                starred: 0,
            };

            await Operator.createRecord<IBookmark>("bookmarks", bookmarkData);

            const result = await Bookmark.exists(bookmarkData.id);
            expect(result).toBeDefined();
            expect(result?.id).toBe(bookmarkData.id);
        });

        it("should return a bookmark if it exists (instance method)", async () => {
            const bookmarkData: IBookmark = {
                id: "10",
                title: "Existing Bookmark (Instance)",
                url: "https://example.com",
                description: "A test bookmark",
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                tags: [],
                archived: 0,
                starred: 0,
            };

            const bookmark = new Bookmark(bookmarkData);
            await bookmark.create();

            const result = await bookmark.exists();
            expect(result).toBeDefined();
            expect(result?.id).toBe(bookmark.id);
        });

        it("should return null if the bookmark does not exist", async () => {
            const bookmarkData: IBookmark = {
                id: "non-existent-id",
                title: "Non Existent Bookmark (Instance)",
                url: "https://example.com",
                description: "A test bookmark",
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                tags: [],
                archived: 0,
                starred: 0,
            };

            const bookmark = new Bookmark(bookmarkData);
            expect(await Bookmark.exists(bookmark.id)).toBeNull();
            expect(await bookmark.exists()).toBeNull();

        });

        it("should handle database errors properly", async () => {
            const bookmarkData: IBookmark = {
                id: "error-id",
                title: "Error Bookmark (Instance)",
                url: "https://example.com",
                description: "A test bookmark",
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                tags: [],
                archived: 0,
                starred: 0,
            };

            const bookmark = new Bookmark(bookmarkData);
            vi.spyOn(Operator, "getRecordById").mockRejectedValue(new Error("DB error"));

            await expect(Bookmark.exists(bookmark.id)).rejects.toThrow(
                /An error occurred in Bookmark.bokmarkExists/
            );

            await expect(bookmark.exists()).rejects.toThrow(
                /An error occurred in Bookmark.bokmarkExists/
            );

            vi.restoreAllMocks();
        });
    });

    describe("Method: bookmark.getBookmarks()", () => {
        it("should return all bookmarks", async () => {
            const bookmark1: IBookmark = {
                id: "11",
                title: "Bookmark 1",
                url: "https://example1.com",
                description: "First bookmark",
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                tags: [],
                archived: 0,
                starred: 0,
            };

            const bookmark2: IBookmark = {
                id: "12",
                title: "Bookmark 2",
                url: "https://example2.com",
                description: "Second bookmark",
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                tags: [],
                archived: 0,
                starred: 0,
            };

            await Operator.createRecord<IBookmark>("bookmarks", bookmark1);
            await Operator.createRecord<IBookmark>("bookmarks", bookmark2);

            const bookmarks = await Bookmark.getBookmarks();
            expect(bookmarks).toHaveLength(2);
            expect(bookmarks.map((b) => b.id)).toContain(bookmark1.id);
            expect(bookmarks.map((b) => b.id)).toContain(bookmark2.id);
        });

        it("should return an empty array if no bookmarks exist", async () => {
            await Operator.clearStore("bookmarks"); // Clear the store

            const bookmarks = await Bookmark.getBookmarks();
            expect(bookmarks).toEqual([]);
        });

        it("should handle database errors properly", async () => {
            vi.spyOn(Operator, "getRecords").mockRejectedValue(new Error("DB error"));

            await expect(Bookmark.getBookmarks()).rejects.toThrow(
                /An error occurred in Bookmark.getBookmarks/
            );

            vi.restoreAllMocks();
        });
    });

    describe("Method: bookmark.archive()", () => {
        it("should set archived to 1 and update the bookmark", async () => {
            const bookmark = new Bookmark({
                id: "13",
                title: "Bookmark to Archive",
                url: "https://archive.com",
                description: "Will be archived",
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                tags: [],
                archived: 0,
                starred: 0,
            });

            await bookmark.create();
            await bookmark.archive();

            const updatedBookmark = await Operator.getRecordById<IBookmark>('bookmarks', bookmark.id);
            expect(updatedBookmark?.archived).toBe(1);
        });

        it("should throw an error if the bookmark does not exist", async () => {
            const fakeBookmark = new Bookmark({
                id: "non-existent",
                title: "Fake Bookmark",
                url: "https://fake.com",
                description: "Will be archived",
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                tags: [],
                archived: 0,
                starred: 0,
            });
            await expect(fakeBookmark.archive()).rejects.toThrow(/Bookmark.update: Bookmark does not exist/);
        });
    });

    describe("Method: Bookmark.getBookmarkById()", () => {
        it("should return a bookmark if found", async () => {
            const bookmarkData: IBookmark = {
                id: "14",
                title: "Find Me",
                url: "https://find.com",
                description: "A bookmark to find",
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                tags: [],
                archived: 0,
                starred: 0,
            };

            await Operator.createRecord<IBookmark>("bookmarks", bookmarkData);

            const result = await Bookmark.getBookmarkById(bookmarkData.id);
            expect(result).toBeDefined();
            expect(result.id).toBe(bookmarkData.id);
        });

        it("should return null if the bookmark does not exist", async () => {
            const result = await Bookmark.getBookmarkById("non-existent-id");
            expect(result).toBeNull();
        });

        it("should handle database errors properly", async () => {
            vi.spyOn(Operator, "getRecordById").mockRejectedValue(new Error("DB error"));

            await expect(Bookmark.getBookmarkById("error-id")).rejects.toThrow(
                /An error occurred in Bookmark.getBookmarkById/
            );

            vi.restoreAllMocks();
        });
    });

    describe("Method: Bookmark.toggleStarred()", () => {
        it("should toggle starred from 0 to 1", async () => {
            const bookmark = new Bookmark({
                id: "15",
                title: "Toggle Star",
                url: "https://togglestar.com",
                description: "Testing starred toggle",
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                tags: [],
                archived: 0,
                starred: 0,
            });

            await bookmark.create();
            const updated = await Bookmark.toggleStarred(bookmark);
            expect(updated.starred).toBe(1);
        });

        it("should toggle starred from 1 to 0", async () => {
            const bookmark = new Bookmark({
                id: "16",
                title: "Unstar Me",
                url: "https://unstar.com",
                description: "Removing star",
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                tags: [],
                archived: 0,
                starred: 1,
            });

            await bookmark.create();
            await Bookmark.toggleStarred(bookmark);
            const updated = await bookmark.exists();
            expect(updated).toBeDefined();
            expect(updated?.starred).toBe(0);
        });

        it("should throw an error if the bookmark does not exist", async () => {
            const fakeBookmark = { id: "non-existent" } as IBookmark;
            await expect(Bookmark.toggleStarred(fakeBookmark)).rejects.toThrow(/Bookmark.toggleStarred: Bookmark not found/);
        });
    });

    describe("Method: Bookmark.getFavorites()", () => {
        it("should return only starred bookmarks", async () => {
            const bookmark1: IBookmark = {
                id: "17",
                title: "Starred Bookmark 1",
                url: "https://star1.com",
                description: "First starred bookmark",
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                tags: [],
                archived: 0,
                starred: 1,
            };

            const bookmark2: IBookmark = {
                id: "18",
                title: "Starred Bookmark 2",
                url: "https://star2.com",
                description: "Second starred bookmark",
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                tags: [],
                archived: 0,
                starred: 1,
            };

            const bookmark3: IBookmark = {
                id: "19",
                title: "Unstarred Bookmark",
                url: "https://nostar.com",
                description: "Not starred",
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                tags: [],
                archived: 0,
                starred: 0,
            };

            await Operator.createRecord<IBookmark>("bookmarks", bookmark1);
            await Operator.createRecord<IBookmark>("bookmarks", bookmark2);
            await Operator.createRecord<IBookmark>("bookmarks", bookmark3);

            const favorites = await Bookmark.getFavorites();
            expect(favorites).toHaveLength(2);
            expect(favorites.map((b) => b.id)).toContain(bookmark1.id);
            expect(favorites.map((b) => b.id)).toContain(bookmark2.id);
        });

        it("should return an empty array if no bookmarks are starred", async () => {
            await indexedDB.deleteDatabase("bmm"); // Clear the database

            const favorites = await Bookmark.getFavorites();
            expect(favorites).toEqual([]);
        });

        it("should handle database errors properly", async () => {
            vi.spyOn(Operator, "getRecords").mockRejectedValue(new Error("DB error"));

            await expect(Bookmark.getFavorites()).rejects.toThrow(
                /An error occurred in Bookmark.getFavorites/
            );

            vi.restoreAllMocks();
        });
    });

});
