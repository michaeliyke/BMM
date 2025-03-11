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
import { IBookmark, IDeletedBookmark } from "../../utils/types/schemas";
import { Operator } from "../operator";
import Bookmark from "./bookmark";
import BookmarkBin from "./bookmark_bin";
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

    beforeEach(async () => {
        await Operator.clearStores(db);
    });

    describe("Constructor: BookmarkBin", () => {
        it("should correctly assign all properties when valid data is provided", () => {
            const data: IDeletedBookmark = {
                id: "123",
                bookmark_id: "abc",
                title: "Test Bookmark",
                url: "https://example.com",
                description: "Test description",
                created_at: "2025-03-11T12:00:00Z",
                updated_at: "2025-03-11T12:30:00Z",
                deleted_at: "2025-03-11T13:00:00Z",
                tag_ids: "tag1,tag2",
                category_ids: "cat1,cat2",
                note_ids: "note1,note2"
            };
            const bookmarkBin = new BookmarkBin(data);

            expect(bookmarkBin).toMatchObject(data);
        });

        it("should set empty strings for optional fields when missing", () => {
            const data: IDeletedBookmark = {
                id: "123",
                bookmark_id: "abc",
                title: "Test Bookmark",
                url: "https://example.com",
                description: "Test description",
                created_at: "2025-03-11T12:00:00Z",
                updated_at: "2025-03-11T12:30:00Z",
                deleted_at: "2025-03-11T13:00:00Z",
                tag_ids: "",
                category_ids: "",
                note_ids: ""
            };

            const bookmarkBin = new BookmarkBin(data);

            expect(bookmarkBin.tag_ids).toBe("");
            expect(bookmarkBin.category_ids).toBe("");
            expect(bookmarkBin.note_ids).toBe("");
        });

        it("should throw an error if required fields are missing", () => {
            expect(() => new BookmarkBin({} as any)).toThrow();
        });

        it("should throw an error if id or bookmark_id is missing", () => {
            expect(() => new BookmarkBin({ bookmark_id: "abc" } as any)).toThrow();
            expect(() => new BookmarkBin({ id: "123" } as any)).toThrow();
        });
    });

    describe("Method: BookmarkBin.exists()", () => {
        let bookmarkBin: BookmarkBin;
        let testBookmark: IDeletedBookmark;

        beforeEach(async () => {
            testBookmark = {
                id: "123",
                bookmark_id: "abc",
                title: "Test Bookmark",
                url: "https://example.com",
                description: "Test description",
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                deleted_at: new Date().toISOString(),
                tag_ids: "",
                category_ids: "",
                note_ids: "",
            };

            await Operator.createRecord<IDeletedBookmark>("bookmark_bin", testBookmark);
            bookmarkBin = new BookmarkBin(testBookmark);
        });

        it("should return the deleted bookmark if it exists", async () => {
            const result = await bookmarkBin.exists();
            expect(result).toEqual(testBookmark);
        });

        it("should return null if the bookmark does not exist", async () => {
            const nonExistent = new BookmarkBin({ ...testBookmark, id: "999" });
            const result = await nonExistent.exists();
            expect(result).toBeNull();
        });

        it("should throw an error if an unexpected failure occurs", async () => {
            const spy = vi.spyOn(Operator, "getRecordById").mockRejectedValue(new Error("DB Failure"));
            try {
                await expect(bookmarkBin.exists()).rejects.toThrowError(
                    /DB Failure, 123/
                );
            } catch (error) {
                expect(error).toBeInstanceOf(Error);
                if (error instanceof Error) {
                    expect(error.message).toContain("DB Failure, 123");
                }
            } finally {
                spy.mockRestore();
            }
        });
    });

    describe("Method: BookmarkBin.getDeleted()", () => {
        let testBookmark: IDeletedBookmark;

        beforeEach(async () => {
            testBookmark = {
                id: "123",
                bookmark_id: "abc",
                title: "Test Bookmark",
                url: "https://example.com",
                description: "Test description",
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                deleted_at: new Date().toISOString(),
                tag_ids: "",
                category_ids: "",
                note_ids: "",
            };

            await Operator.createRecord("bookmark_bin", testBookmark);
        });

        it("should return the deleted bookmark if it exists", async () => {
            const result = await new BookmarkBin(testBookmark).getDeleted(testBookmark.id);
            expect(result).toEqual(testBookmark);
        });

        it("should return null if the bookmark does not exist", async () => {
            const result = await new BookmarkBin(testBookmark).getDeleted("999");
            expect(result).toBeNull();
        });

        it("should throw an error if an unexpected failure occurs", async () => {
            const spy = vi.spyOn(Operator, "getRecordById").mockRejectedValue(new Error("DB Failure"));
            try {
                await expect(new BookmarkBin(testBookmark).getDeleted(testBookmark.id)).rejects.toThrowError(
                    /DB Failure, 123/
                );
            } catch (error) {
                expect(error).toBeInstanceOf(Error);
                if (error instanceof Error) {
                    expect(error.message).toContain("DB Failure, 123");
                }
            } finally {
                spy.mockRestore();
            }
        });
    });

    describe("Method: BookmarkBin.getDeletedBookmarks()", () => {
        let deletedBookmarks: IDeletedBookmark[];

        beforeEach(async () => {
            deletedBookmarks = [
                {
                    id: "123",
                    bookmark_id: "abc",
                    title: "Bookmark 1",
                    url: "https://example.com/1",
                    description: "Test description 1",
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                    deleted_at: new Date().toISOString(),
                    tag_ids: "",
                    category_ids: "",
                    note_ids: "",
                },
                {
                    id: "456",
                    bookmark_id: "def",
                    title: "Bookmark 2",
                    url: "https://example.com/2",
                    description: "Test description 2",
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                    deleted_at: new Date().toISOString(),
                    tag_ids: "",
                    category_ids: "",
                    note_ids: "",
                }
            ];

            await Operator.createRecord("bookmark_bin", deletedBookmarks[0]);
            await Operator.createRecord("bookmark_bin", deletedBookmarks[1]);
        });

        it("should return an array of deleted bookmarks", async () => {
            const results = await BookmarkBin.getDeletedBookmarks();
            expect(results).toEqual(expect.arrayContaining(deletedBookmarks));
        });

        it("should return an empty array if no deleted bookmarks exist", async () => {
            await Operator.deleteRecord("bookmark_bin", "123");
            await Operator.deleteRecord("bookmark_bin", "456");

            const results = await BookmarkBin.getDeletedBookmarks();
            expect(results).toEqual([]);
        });

        it("should throw an error if an unexpected failure occurs", async () => {
            const spy = vi.spyOn(Operator, "getRecords").mockRejectedValue(new Error("DB Failure"));
            try {
                await expect(BookmarkBin.getDeletedBookmarks()).rejects.toThrowError(
                    /DB Failure/
                );
            } catch (error) {
                expect(error).toBeInstanceOf(Error);
                if (error instanceof Error) {
                    expect(error.message).toContain("DB Failure");
                }
            } finally {
                spy.mockRestore();
            }
        });
    });

    describe("Method: BookmarkBin.moveToBin()", () => {
        let bookmark: Bookmark;
        let bookmarkBin: BookmarkBin;
        let testBookmark: IDeletedBookmark;

        beforeEach(async () => {
            testBookmark = {
                id: "123",
                bookmark_id: "abc",
                title: "Test Bookmark",
                url: "https://example.com",
                description: "Test description",
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                deleted_at: new Date().toISOString(),
                tag_ids: "",
                category_ids: "",
                note_ids: "",
            };

            bookmark = new Bookmark({
                id: testBookmark.bookmark_id,
                title: testBookmark.title,
                url: testBookmark.url,
                description: testBookmark.description,
                created_at: testBookmark.created_at,
                updated_at: testBookmark.updated_at,
                tags: [],
                archived: 0,
            });

            await Operator.createRecord("bookmarks", bookmark);
            bookmarkBin = new BookmarkBin(testBookmark);
        });

        it("should move a bookmark to bin successfully", async () => {
            await bookmarkBin.moveToBin();

            const deleted = await Operator.getRecordById<IDeletedBookmark>("bookmark_bin", testBookmark.id);
            expect(deleted).toEqual(expect.objectContaining({ id: testBookmark.id }));

            const original = await Operator.getRecordById("bookmarks", testBookmark.bookmark_id);
            expect(original).toBeUndefined();
        });

        it("should throw an error if the original bookmark does not exist", async () => {
            await Operator.deleteRecord("bookmarks", testBookmark.bookmark_id);
            await expect(bookmarkBin.moveToBin()).rejects.toThrowError(
                `Bookmark not found`
            );
        });

        it("should log a warning if the bookmark already exists in bin", async () => {
            console.warn = vi.fn();
            await bookmarkBin.moveToBin(); // First move
            await bookmarkBin.moveToBin(); // Second move should trigger warning
            expect(console.warn).toHaveBeenCalledWith(`Bookmark already exists in bin:- ${testBookmark.id}`);
        });

        it("should throw an error if an unexpected failure occurs", async () => {
            const spy = vi.spyOn(Operator, "createRecord").mockRejectedValue(new Error("DB Failure"));
            try {
                await expect(bookmarkBin.moveToBin()).rejects.toThrowError(
                    /DB Failure/
                );
            } catch (error) {
                expect(error).toBeInstanceOf(Error);
                if (error instanceof Error) {
                    expect(error.message).toContain("DB Failure");
                }
            } finally {
                spy.mockRestore();
            }
        });
    });

    describe("Method: BookmarkBin.restore()", () => {
        let testBookmark: IDeletedBookmark;
        let bookmarkBin: BookmarkBin;

        beforeEach(async () => {
            testBookmark = {
                id: "123",
                bookmark_id: "abc",
                title: "Test Bookmark",
                url: "https://example.com",
                description: "Test description",
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                deleted_at: new Date().toISOString(),
                tag_ids: "tag1,tag2",
                category_ids: "cat1,cat2",
                note_ids: "note1,note2"
            };

            bookmarkBin = new BookmarkBin(testBookmark);
            await Operator.createRecord("bookmark_bin", testBookmark);
        });

        it("should restore a deleted bookmark and remove it from bookmark_bin", async () => {
            await bookmarkBin.restore();

            const restoredBookmark = await Operator.getRecordById<IBookmark>("bookmarks", testBookmark.bookmark_id);
            expect(restoredBookmark).toMatchObject({
                id: "abc",
                title: "Test Bookmark",
                url: "https://example.com"
            });

            const deletedBookmark = await Operator.getRecordById<IDeletedBookmark>("bookmark_bin", testBookmark.id);
            expect(deletedBookmark).toBeUndefined();
        });

        it("should throw an error if the bookmark already exists in bookmarks", async () => {
            await Operator.createRecord("bookmarks", { id: testBookmark.bookmark_id });

            await expect(bookmarkBin.restore()).rejects.toThrowError(
                new RegExp(`Bookmark already exists:- ${testBookmark.bookmark_id}`)
            );
        });

        it("should throw an error if the bookmark is not found in bookmark_bin", async () => {
            await Operator.deleteRecord("bookmark_bin", testBookmark.id);

            await expect(bookmarkBin.restore()).rejects.toThrowError(
                new RegExp(`Bookmark not found in bin:- ${testBookmark.id}`)
            );
        });

        it("should throw an error if an unexpected failure occurs", async () => {
            const spy = vi.spyOn(Operator, "createRecord").mockRejectedValue(new Error("DB Failure"));
            try {
                await expect(bookmarkBin.restore()).rejects.toThrowError(
                    /DB Failure/
                );
            } catch (error) {
                expect(error).toBeInstanceOf(Error);
                if (error instanceof Error) {
                    expect(error.message).toContain("DB Failure");
                }
            } finally {
                spy.mockRestore();
            }
        });
    });
});
