import { indexedDB } from "fake-indexeddb";

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

    // Let's use describe to test each method of Operator object literal for better organization
    // and readability. We start with method initializeDatabase.
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
});
