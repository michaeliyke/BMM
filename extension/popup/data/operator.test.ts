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
import { Operator } from "./operator";
globalThis.indexedDB = indexedDB;

describe("INTEGRATED TESTS FOR DATA Operator", async () => {
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
        });

        it("should create the users store", () => { // users store
            expect(db.objectStoreNames.contains("users")).toBe(true);
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

    describe("Method: Operator.deleteRecord()", () => {
        it("should delete a record by id", async () => {
            const record = { id: "222", name: "Bookmark to delete" };
            await Operator.createRecord("bookmarks", record);

            await Operator.deleteRecord("bookmarks", "222");
            const result = await Operator.getRecordById("bookmarks", "222");

            expect(result).toBeUndefined();
        });

        it("should not throw if deleting a non-existent record", async () => {
            await expect(Operator.deleteRecord("bookmarks", "non-existent-id")).resolves.not.toThrow();
        });
    });

    describe("Method: Operator.updateRecord()", () => {
        it("should update an existing record", async () => {
            const record = { id: "333", name: "Old Name" };
            await Operator.createRecord("bookmarks", record);

            const updatedRecord = { id: "333", name: "New Name" };
            await Operator.updateRecord("bookmarks", updatedRecord);

            const result = await Operator.getRecordById("bookmarks", "333");
            expect(result).toEqual(updatedRecord);
        });

        it("should throw an error if updating a non-existent record", async () => {
            const nonExistent = { id: "99", name: "Does not exist" };
            await expect(Operator.updateRecord("bookmarks", nonExistent)).rejects.toThrow();
        });
    });

    describe("Method: Operator.deleteRecordsByIndex()", () => {
        beforeEach(async () => {
            await Operator.clearStore("tags"); // Clear the store to be used
            // Seed data for tests
            await Operator.createRecord("tags", { id: "1", name: "Tag A", type: "Tech" });
            await Operator.createRecord("tags", { id: "2", name: "Tag B", type: "Tech" });
            await Operator.createRecord("tags", { id: "3", name: "Tag C", type: "Science" });
        });

        const range = IDBKeyRange.bound("Tag A", "Tag B");

        it("should delete multiple records matching an index query", async () => {
            const beforeDelete = await Operator.getRecordsByIndex("tags", "tags_index", range);
            expect(beforeDelete.length).toBe(2);

            await Operator.deleteRecordsByIndex("tags", "tags_index", range);

            const afterDelete = await Operator.getRecordsByIndex("tags", "tags_index", range);
            expect(afterDelete).toEqual([]); // Should be empty
        });

        it("should delete a single record if only one matches", async () => {
            await Operator.deleteRecordsByIndex("tags", "tags_index", "Tag C");

            const afterDelete = await Operator.getRecordsByIndex("tags", "tags_index", "Tag C");
            expect(afterDelete).toEqual([]); // Should be empty
        });

        it("should not delete records outside the query range", async () => {
            await Operator.deleteRecordsByIndex("tags", "tags_index", range);

            const remaining: Array<{ name: string }> = await Operator.getRecords("tags");
            expect(remaining.length).toBe(1);
            expect(remaining[0].name).toBe("Tag C");
        });

        it("should handle cases where no records match", async () => {
            await expect(Operator.deleteRecordsByIndex("tags", "tags_index", "NonExistent")).resolves.not.toThrow();
            const allRecords = await Operator.getRecords("tags");
            expect(allRecords.length).toBe(3);
        });

        it("should reject if the index does not exist", async () => {
            await expect(Operator.deleteRecordsByIndex("tags", "non_existent_index", range)).rejects.toThrow();
        });

        it("should reject if transaction fails", async () => {
            vi.spyOn(indexedDB, "open").mockImplementationOnce(() => {
                throw new Error("Fake DB failure");
            });

            await expect(Operator.deleteRecordsByIndex("tags", "tags_index", range)).rejects.toThrow("Fake DB failure");
        });
    });

    describe("Method: Operator.clearStore()", () => {
        beforeEach(async () => {
            await Operator.clearStore("bookmarks"); // Clear the store to be used
            await Operator.createRecord("bookmarks", { id: "1", name: "Bookmark 1" });
            await Operator.createRecord("bookmarks", { id: "2", name: "Bookmark 2" });
        });

        it("should clear all records from the specified store", async () => {
            await Operator.clearStore("bookmarks");

            const result = await Operator.getRecords("bookmarks");
            expect(result).toEqual([]);
        });

        it("should not throw if the store is already empty", async () => {
            await Operator.clearStore("bookmarks"); // Clear once
            await expect(Operator.clearStore("bookmarks")).resolves.not.toThrow(); // Clear again
        });

        it("should reject if the store does not exist", async () => {
            await expect(Operator.clearStore("nonexistentStore")).rejects.toThrow();
        });
    });
});

