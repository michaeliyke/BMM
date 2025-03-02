import { IDBKeyRange, indexedDB } from "fake-indexeddb";

globalThis.indexedDB = indexedDB;


import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { Operator } from "./operator";

describe("INTEGRATED TESTS FOR DATA Operator", () => {
    let db: IDBDatabase;

    beforeAll(async () => {
        db = await Operator.initializeDatabase();
    });

    afterAll(() => {
        db.close();
        indexedDB.deleteDatabase("bmm");
    });

    describe("Method: Operator.initializeDatabase()", () => {

        it("should create the bookmarks store", () => { // Bookmarks store
            expect(db.objectStoreNames.contains("bookmarks")).toBe(true);
        });

        it("should create the tags store and its index", () => { // Tags store
            expect(db.objectStoreNames.contains("tags")).toBe(true);
            const store = db.transaction("tags").objectStore("tags");
            expect(store.indexNames.contains("tags_index")).toBe(true);
        });

        it("should create the categories store and its indexes", () => { // categories store
            expect(db.objectStoreNames.contains("categories")).toBe(true);
            const store = db.transaction("categories").objectStore("categories");
            expect(store.indexNames.contains("categories_index")).toBe(true);
            expect(store.indexNames.contains("default_category_index")).toBe(true);
        });

        it("should create the users store", () => { // users store
            expect(db.objectStoreNames.contains("users")).toBe(true);
        });

        it("should create the bookmark_bin store", () => { // bookmark_bin store
            expect(db.objectStoreNames.contains("bookmark_bin")).toBe(true);
        });

        it("should create the bookmark_tags store with index", () => { // bookmark_tags store
            expect(db.objectStoreNames.contains("bookmark_tags")).toBe(true);
            const store = db.transaction("bookmark_tags").objectStore("bookmark_tags");
            expect(store.indexNames.contains("bookmark_tags_index")).toBe(true);
        });

        it("should create the category_bookmarks store with index", () => { // category_bookmarks store
            expect(db.objectStoreNames.contains("category_bookmarks")).toBe(true);
            const store = db.transaction("category_bookmarks").objectStore("category_bookmarks");
            expect(store.indexNames.contains("category_bookmarks_index")).toBe(true);
        });

        it("should create the category_tags store with index", () => { // category_tags store
            expect(db.objectStoreNames.contains("category_tags")).toBe(true);
            const store = db.transaction("category_tags").objectStore("category_tags");
            expect(store.indexNames.contains("category_tags_index")).toBe(true);
        });
    });

    describe("Method: Operator.createRecord()", () => {
        it("should add a record to the specified store", async () => {
            const data = { id: "123", name: "Test Bookmark" };
            const result = await Operator.createRecord("bookmarks", data);
            expect(result).toEqual(data);

            const tx = db.transaction("bookmarks", "readonly");
            const store = tx.objectStore("bookmarks");
            const request = store.get("123");

            await new Promise((resolve) => {
                request.onsuccess = () => {
                    expect(request.result).toEqual(data);
                    resolve(null);
                };
            });
        });
    });

    describe("Method: Operator.getRecordById()", () => {
        it("should retrieve a record by ID from the specified store", async () => {
            const data = { id: "456", name: "Sample Bookmark" };
            await Operator.createRecord("bookmarks", data);

            const result = await Operator.getRecordById("bookmarks", "456");
            expect(result).toEqual(data);
        });

        it("should return undefined if the record does not exist", async () => {
            const result = await Operator.getRecordById("bookmarks", "nonexistent");
            expect(result).toBeUndefined();
        });
    });

    describe("Method: Operator.getRecords()", () => {
        it("should retrieve all records from the specified store", async () => {
            const data = [
                { id: "1", name: "Bookmark 1" },
                { id: "2", name: "Bookmark 2" },
            ];
            await Operator.createRecord("bookmarks", data[0]);
            await Operator.createRecord("bookmarks", data[1]);

            const result = await Operator.getRecords("bookmarks");
            expect(result).toEqual(expect.arrayContaining(data));
        });
    });

    describe("Method: Operator.getRecordsByIndex()", async () => {
        const data = [
            // want to work with only one index here since indexes are unique
            // Usually, I use this method to search for indexes by range
            // I will modify later for this
            { id: "6", name: "Bookmark 1", type: "Technology" },
            { id: "7", name: "Bookmark 2", type: "Technology2" },
            { id: "8", name: "Bookmark 3", type: "Science" },
        ];
        await Operator.createRecord("tags", data[0]);
        await Operator.createRecord("tags", data[1]);
        await Operator.createRecord("tags", data[2]);

        it("should retrieve records matching the index query", async () => {
            const result = await Operator.getRecordsByIndex("tags", "tags_index", "Bookmark 1");
            expect(result).toEqual(expect.arrayContaining([data[0]]));
        });

        it("should return an empty array if no records match", async () => {
            const result = await Operator.getRecordsByIndex("tags", "tags_index", "NonExistent");
            expect(result).toEqual([]);
        });

        it("should reject if the store or index does not exist", async () => {
            await expect(Operator.getRecordsByIndex("invalidStore", "tags_index", "Technology")).rejects.toThrow();
        });

        it("should retrieve records within a specified key range", async () => {
            const range = IDBKeyRange.bound("Bookmark 1", "Bookmark 2");
            const result = await Operator.getRecordsByIndex("tags", "tags_index", range);
            expect(result).toEqual(expect.arrayContaining([data[0], data[1]]));
        });

        it("should retrieve records within a specified key range", async () => {
            const range = IDBKeyRange.bound("Bookmark 1", "Bookmark 6");
            const result = await Operator.getRecordsByIndex("tags", "tags_index", range);
            expect(result).toEqual(data);
        });

        it("should throw if lower is greater than upper bound for a key range", async () => {
            try {
                IDBKeyRange.bound("Bookmark 3", "Bookmark 1");
            } catch (error) {
                expect(error).toBeInstanceOf(DOMException);
            }
        });
    });

    describe("Method: Operator.getRecordByIndex()", () => {
        it("should retrieve a single record matching the index query", async () => {
            const data = { id: "3", name: "Science Category", type: "Education" };
            await Operator.createRecord("categories", data);

            const result = await Operator.getRecordByIndex("categories", "categories_index", "Science Category");
            expect(result).toEqual(data);
        });

        it("should return undefined if no matching record is found", async () => {
            const result = await Operator.getRecordByIndex("categories", "categories_index", "NonExistent");
            expect(result).toBeUndefined();
        });

        it("should reject if the store or index does not exist", async () => {
            await expect(Operator.getRecordByIndex("invalidStore", "categories_index", "Science Category")).rejects.toThrow();
        });
    });


});
