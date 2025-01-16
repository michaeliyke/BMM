import { QueueManager } from "../utils/locker";
import { ICategory } from "../utils/types/schemas";

const queueManager = new QueueManager();

export const Operator = {
    /**
     * Initializes the IndexedDB database with the necessary object stores and indexes.
     *
     * This method creates the following object stores and indexes if they do not already exist:
     * - `bookmarks`: Stores bookmark data with a primary key `id` and an index `bookmarks_index` on `id`.
     * - `tags`: Stores tag data with a primary key `id` and an index `tags_index` on `id`.
     * - `categories`: Stores category data with a primary key `id`, an index `default_category_index` on `is_default`, and an index `categories_index` on `id`.
     * - `users`: Stores user data with a primary key `id`.
     * - `bookmark_tags`: Stores relationships between bookmarks and tags with a primary key `id` and a compound index `bookmark_tags_index` on `bookmark_id` and `tag_id`.
     * - `category_bookmarks`: Stores relationships between categories and bookmarks with a primary key `id` and a compound index `category_bookmarks_index` on `category_id` and `bookmark_id`.
     * - `category_tags`: Stores relationships between categories and tags with a primary key `id` and a compound index `category_tags_index` on `category_id` and `tag_id`.
     *
     * @returns {Promise<IDBDatabase>} A promise that resolves to the initialized IndexedDB database instance.
     * @throws {DOMException} If there is an error opening or upgrading the database.
     */
    async initializeDatabase(): Promise<IDBDatabase> {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open("bmm", 1);
            const unique = { unique: true };

            // compound keys
            const bookmarkTag = ["bookmark_id", "tag_id"];
            const categoryBookmark = ["category_id", "bookmark_id"];
            const categoryTag = ["category_id", "tag_id"];

            // Create a schema or upgrade an existing one
            request.onupgradeneeded = function upgrade() {
                const db = request.result;

                // bookmarks table
                // No need for index here as only the PK (id) needs to be unique
                if (!db.objectStoreNames.contains("bookmarks"))
                    db.createObjectStore("bookmarks", { keyPath: "id" });

                // tags table: uniqueness needed for the name field
                if (!db.objectStoreNames.contains("tags"))
                    db.createObjectStore("tags", { keyPath: "id" })
                        .createIndex("tags_index", "name", unique);

                // categories table: uniqueness needed for the name field
                if (!db.objectStoreNames.contains("categories")) {
                    const temp = db.createObjectStore("categories", { keyPath: "id" });
                    temp.createIndex("default_category_index", "is_default");
                    temp.createIndex("categories_index", "name", unique);
                }

                // users table
                if (!db.objectStoreNames.contains("users"))
                    db.createObjectStore("users", { keyPath: "id" });

                /* RELATIONSHIP TABLES */

                // Between bookmarks and tags
                if (!db.objectStoreNames.contains("bookmark_tags")) // bookmark_tag table
                    db.createObjectStore("bookmark_tags", { keyPath: "id" })
                        .createIndex("bookmark_tags_index", bookmarkTag, unique);

                // Between bookmarks and categories
                if (!db.objectStoreNames.contains("category_bookmarks")) // category_bookmark table
                    db.createObjectStore("category_bookmarks", { keyPath: "id" })
                        .createIndex("category_bookmarks_index", categoryBookmark, unique);

                // Between categories and tags
                if (!db.objectStoreNames.contains("category_tags")) // category_tag table
                    db.createObjectStore("category_tags", { keyPath: "id" })
                        .createIndex("category_tags_index", categoryTag, unique);
            };

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    },

    /**
     * Waits for the given IndexedDB transaction to complete.
     *
     * This function returns a promise that resolves when the transaction completes successfully,
     * and rejects if the transaction encounters an error or is aborted.
     *
     * @param {IDBTransaction} tx - The IndexedDB transaction to wait for.
     * @returns {Promise<void>} A promise that resolves when the transaction is complete, or rejects if an error occurs.
     */
    async waitForTransactionComplete(tx: IDBTransaction): Promise<void> {
        return new Promise((resolve, reject) => {
            tx.oncomplete = () => resolve();
            tx.onerror = () => reject(tx.error);
            tx.onabort = () => reject(tx.error);
        });
    },

    /**
     * Iterates over an IndexedDB cursor and processes each entry using the provided callback function.
     *
     * @param request - The IDBRequest object that provides the cursor.
     * @param processCursor - A callback function that processes each cursor entry.
     * @returns A Promise that resolves when the cursor has iterated over all entries.
     */
    async iterateCursor(request: IDBRequest<IDBCursorWithValue | null>,
        processCursor: (cursor: IDBCursorWithValue) => void): Promise<void> {
        return queueManager.enqueue(async () => {
            return new Promise<void>((resolve, reject) => {
                request.onsuccess = () => {
                    const cursor = request.result;
                    if (cursor) {
                        processCursor(cursor);
                        cursor.continue();
                    } else {
                        resolve();
                    }
                };
                request.onerror = () => reject(request.error);
            });
        });
    },

    /**
     * Retrieves all records from the specified object store.
     *
     * @template T - The type of the records to be retrieved.
     * @param {string} storeName - The name of the object store from which to retrieve records.
     * @returns {Promise<T[]>} A promise that resolves to an array of records of type T.
     * @throws Will reject the promise if there is an error during the transaction or retrieval process.
     */
    async getRecords<T>(storeName: string): Promise<T[]> {
        return queueManager.enqueue(async () => {
            const db = await this.initializeDatabase();
            return await new Promise((resolve, reject) => {
                const tx = db.transaction(storeName, "readonly");
                const store = tx.objectStore(storeName);
                const request = store.getAll();
                request.onsuccess = () => resolve(request.result);
                request.onerror = () => reject(request.error);
            });
        });
    },

    /**
     * Retrieves a single record from a specified store by its ID.
     *
     * @template T - The type of the record to be retrieved.
     * @param {string} storeName - The name of the store from which to retrieve the record.
     * @param {string} id - The ID of the record to retrieve.
     * @returns {Promise<T>} A promise that resolves to the retrieved record.
     * @throws Will reject the promise if there is an error during the retrieval process.
     */
    async getRecordById<T>(storeName: string, id: string): Promise<T> {
        return queueManager.enqueue(async () => {
            const db = await this.initializeDatabase();
            return await new Promise((resolve, reject) => {
                const tx = db.transaction(storeName, "readonly");
                const store = tx.objectStore(storeName);
                const request = store.get(id);

                request.onsuccess = () => resolve(request.result);
                request.onerror = () => reject(request.error);
            });
        });
    },

    /**
     * Adds a single data record to a specified store in the database.
     *
     * @template T - The type of the data to be added.
     * @param {string} storeName - The name of the store where the data will be added.
     * @param {T} data - The data to be added to the store.
     * @returns {Promise<void>} A promise that resolves when the data has been successfully added, or rejects with an error.
     */
    async createRecord<T>(storeName: string, data: T): Promise<T> {
        return queueManager.enqueue(async () => {
            const db = await this.initializeDatabase();
            return new Promise((resolve, reject) => {
                const tx = db.transaction(storeName, "readwrite");
                const store = tx.objectStore(storeName);
                const request = store.add(data);
                request.onerror = () => reject(request.error);
                request.onsuccess = () => resolve(data);
            });
        });
    },

    /**
     * update a single data in a given store identified by storeName and optional key/id
     * @param storeName Name of store
     * @param data New record dta
     * @param key The key path defined while creating the store e.g id
     * @returns Promise that reolves to no value
     */
    async updateRecord<T>(storeName: string, data: T): Promise<void> {
        return queueManager.enqueue(async () => {
            const db = await this.initializeDatabase();
            return new Promise((resolve, reject) => {
                const tx = db.transaction(storeName, "readwrite");
                const store = tx.objectStore(storeName);
                const request = store.put(data);
                request.onerror = () => reject(request.error);
                request.onsuccess = () => resolve();
            });
        });
    },

    /**
     * Deletes a single record from the specified object store in the database.
     *
     * @param storeName - The name of the object store from which to delete the record.
     * @param id - The unique identifier of the record to be deleted.
     * @returns A promise that resolves when the record is successfully deleted, or rejects with an error.
     */
    async deleteRecord(storeName: string, id: string): Promise<void> {
        return queueManager.enqueue(async () => {
            const db = await this.initializeDatabase();
            return new Promise((resolve, reject) => {
                const tx = db.transaction(storeName, "readwrite");
                const store = tx.objectStore(storeName);
                const request = store.delete(id);
                request.onerror = () => reject(request.error);
                request.onsuccess = () => resolve();
            });
        });
    },

    /**
     * Retrieves records from an IndexedDB object store by a specified index.
     *
     * @template T - The type of the records to be retrieved.
     * @param {string} storeName - The name of the object store to query.
     * @param {string} indexName - The name of the index to use for the query.
     * @param {IDBKeyRange | string} [query] - An optional query to filter the records.
     * @returns {Promise<T[]>} A promise that resolves to an array of records of type T.
     * @throws Will reject the promise if there is an error during the transaction or query.
     */
    async getRecordsByIndex<T>(storeName: string, indexName: string, query?: IDBKeyRange | string): Promise<T[]> {
        return queueManager.enqueue(async () => {
            const db = await this.initializeDatabase();
            return await new Promise((resolve, reject) => {
                const tx = db.transaction(storeName, "readonly");
                const store = tx.objectStore(storeName);
                const index = store.index(indexName);
                const request = query ? index.getAll(query) : index.getAll();
                request.onsuccess = () => resolve(request.result);
                request.onerror = () => reject(request.error);
            });
        });
    },

    /**
     * Retrieves a record from an IndexedDB object store by a specified index.
     *
     * @template T - The type of the record to be retrieved.
     * @param {string} storeName - The name of the object store.
     * @param {string} indexName - The name of the index to query.
     * @param {IDBKeyRange | IDBValidKey} query - The key or key range to query the index.
     * @returns {Promise<T>} A promise that resolves to the retrieved record.
     * @throws Will reject the promise if there is an error during the transaction or query.
     */
    async getRecordByIndex<T>(storeName: string, indexName: string, query: IDBKeyRange | IDBValidKey): Promise<T> {
        return queueManager.enqueue(async () => {
            const db = await this.initializeDatabase();
            return await new Promise((resolve, reject) => {
                const tx = db.transaction(storeName, "readonly");
                const store = tx.objectStore(storeName);
                const index = store.index(indexName);
                const request = index.get(query);
                request.onsuccess = () => resolve(request.result);
                request.onerror = () => reject(request.error);
            });
        });
    },

    /**
     * Retrieves the default category from the database.
     *
     * This method initializes the database, starts a read-only transaction on the
     * "categories" object store, and retrieves the record where the `is_default` field is 1
     * using the "default_category_index".
     *
     * @returns {Promise<ICategory>} A promise that resolves to the default category.
     * @throws Will reject the promise if there is an error during the database transaction.
     */
    async getDefaultCategory(): Promise<ICategory> {
        return queueManager.enqueue(async () => {
            const db = await this.initializeDatabase();
            return await new Promise((resolve, reject) => {
                const tx = db.transaction("categories", "readonly");
                const store = tx.objectStore("categories");
                const index = store.index("default_category_index");
                const request = index.get(1);  // return the record whose is_default === 1
                request.onerror = () => reject(request.error);
                request.onsuccess = () => resolve(request.result);
            });
        });
    },

    /**
     * Deletes records from an IndexedDB object store based on a specified index and query.
     *
     * @param storeName - The name of the object store from which to delete records.
     * @param indexName - The name of the index to use for querying records to delete.
     * @param query - The query to match records for deletion. This can be an IDBKeyRange or an IDBValidKey.
     * @returns A promise that resolves when the deletion operation is complete.
     *
     * @throws Will throw an error if there is an issue with the deletion process.
     */
    async deleteRecordsByIndex(storeName: string, indexName: string, query: IDBKeyRange | IDBValidKey): Promise<void> {
        return queueManager.enqueue(async () => {
            const db = await this.initializeDatabase();
            const tx = db.transaction(storeName, "readwrite");
            const store = tx.objectStore(storeName);
            const index = store.index(indexName);
            const request = index.openCursor(query);
            await this.iterateCursor(request, (cursor) => cursor.delete());
        });
    },
};
