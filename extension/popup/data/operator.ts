import { queueManager } from "../utils/locker";
import { IBMM, ICategory, ITag } from "../utils/types/schemas";

type CURSOR = IDBRequest<IDBCursorWithValue | null>;

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
                    db.createObjectStore("categories", { keyPath: "id" })
                        .createIndex("categories_index", "name", unique);
                }

                // users table
                if (!db.objectStoreNames.contains("users"))
                    db.createObjectStore("users", { keyPath: "id" });

                // bookmark_bin table: uniqueness NOT needed
                if (!db.objectStoreNames.contains("bookmark_bin"))
                    db.createObjectStore("bookmark_bin", { keyPath: "id" });
            };

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
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
    async updateRecord<T extends { id: string }>(storeName: string, data: T): Promise<void> {
        return queueManager.enqueue(async () => {
            const db = await this.initializeDatabase();
            return new Promise<void>((resolve, reject) => {
                const tx = db.transaction(storeName, "readwrite");
                const store = tx.objectStore(storeName);
                const key = data.id;
                if (!(typeof (key) === 'string' && key)) { // key must be a non-empty string
                    reject(new Error("Data must have a valid key (e.g., 'id')"));
                    return;
                }

                const getRequest = store.get(key);

                getRequest.onsuccess = () => {
                    if (getRequest.result) {
                        // Record exists, proceed with update
                        const putRequest = store.put(data);
                        putRequest.onsuccess = () => resolve();
                        putRequest.onerror = () => reject(putRequest.error);
                    } else {
                        // Record doesn't exist, reject with an error
                        reject(new Error(`Record with key ${key} not found in ${storeName}.`));
                    }
                };

                getRequest.onerror = () => {
                    reject(getRequest.error);
                };
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
 * Retrieves records from an IndexedDB object store by a specified index using a cursor.
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
            return new Promise<T[]>((resolve, reject) => {
                const tx = db.transaction(storeName, "readonly");
                const store = tx.objectStore(storeName);
                const index = store.index(indexName);
                const results: T[] = [];
                const request: CURSOR = query ? index.openCursor(query) : index.openCursor();

                request.onsuccess = () => {
                    const cursor = request.result;
                    if (cursor) {
                        results.push(cursor.value);
                        cursor.continue();
                        return;
                    }
                    resolve(results);
                };

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
     * Deletes records from an IndexedDB object store by a specified index and query.
     *
     * @param storeName - The name of the object store from which to delete records.
     * @param indexName - The name of the index to use for querying records to delete.
     * @param query - The query to use for selecting records to delete. This can be an IDBKeyRange or an IDBValidKey.
     * @returns A promise that resolves when the records have been deleted.
     *
     * @throws Will reject the promise if there is an error during the transaction or cursor operation.
     */
    async deleteRecordsByIndex(storeName: string, indexName: string, query: IDBKeyRange | IDBValidKey): Promise<void> {
        return queueManager.enqueue(async () => {
            const db = await this.initializeDatabase();
            return new Promise<void>((resolve, reject) => {
                const tx = db.transaction(storeName, "readwrite");
                const store = tx.objectStore(storeName);
                const index = store.index(indexName);
                const request = index.openCursor(query);

                request.onsuccess = (event) => {
                    const cursor = (event.target as IDBRequest<IDBCursorWithValue>).result;
                    if (cursor) {
                        cursor.delete();
                        cursor.continue();
                    }
                };

                request.onerror = (event) => {
                    reject((event.target as IDBRequest<IDBCursorWithValue>).error);
                };

                tx.oncomplete = () => resolve();
                tx.onerror = (event) => reject((event.target as IDBTransaction).error);
                tx.onabort = (event) => reject((event.target as IDBTransaction).error);
            });
        });
    },

    /**
     * Clears all data from the specified object store.
     *
     * @param storeName - The name of the object store to clear.
     * @returns A promise that resolves when the store has been cleared.
     * @throws An error if the transaction fails.
     */
    async clearStore(storeName: string): Promise<void> {
        return queueManager.enqueue(async () => {
            const db = await this.initializeDatabase();
            return new Promise<void>((resolve, reject) => {
                const tx = db.transaction(storeName, "readwrite");
                const store = tx.objectStore(storeName);
                const request = store.openCursor(); // Open a cursor to iterate

                request.onsuccess = (event) => {
                    const cursor = (event.target as IDBRequest<IDBCursorWithValue | null>).result;
                    if (cursor) {
                        cursor.delete(); // Delete the current record
                        cursor.continue(); // Move to the next record
                        return;
                    }
                    resolve(); // Cursor is null, all records deleted
                };

                request.onerror = (event) => {
                    reject((event.target as IDBRequest<IDBCursorWithValue | null>).error);
                };

                tx.onerror = (event) => reject((event.target as IDBTransaction).error);
                tx.onabort = (event) => reject((event.target as IDBTransaction).error);
            });
        });
    },

    async clearStores(db: IDBDatabase, stores: string[] = []): Promise<void> {
        return queueManager.enqueue(async () => {
            return new Promise<void>((resolve, reject) => {
                const storeNames = stores.length > 0 ? stores : [...db.objectStoreNames];
                const tx = db.transaction(storeNames, "readwrite");

                tx.onerror = (event) => reject((event.target as IDBTransaction).error);
                tx.onabort = (event) => reject((event.target as IDBTransaction).error);

                for (const storeName of storeNames) {
                    const request = (tx.objectStore(storeName)).openCursor();

                    request.onsuccess = (event) => {
                        const cursor = (event.target as IDBRequest<IDBCursorWithValue | null>).result;
                        if (cursor) {
                            cursor.delete(); // Delete the current record
                            cursor.continue(); // Move to the next record
                            return;
                        }
                        resolve(); // Cursor is null, all records deleted
                    };

                    request.onerror = (event) => {
                        reject((event.target as IDBRequest<IDBCursorWithValue | null>).error);
                    };
                }
            });
        });
    },

    // Side effects - populates input category objects
    async fillCategories(bmm: IBMM) {
        return queueManager.enqueue(async () => {
            const db = await this.initializeDatabase();
            return new Promise<IBMM>((resolve, reject) => {
                const tx = db.transaction("categories", "readwrite");
                const store = tx.objectStore("categories");
                const request = store.openCursor();

                request.onsuccess = function onSuccess(event) {
                    const cursor = (event.target as IDBRequest<IDBCursorWithValue | null>).result;
                    if (!cursor) return void (0); /* No [more rows | rows found] */

                    // store the category by its ID
                    const category = cursor.value as ICategory;
                    bmm.categoryObjects[category.id] = category;
                    bmm.categories.push(category.id);

                    /* unlinked category */
                    if (category.bookmarkIds.length === 0 && category.tagIds.length === 0)
                        bmm.unlinked.categories.push(category.id);

                    /* populate bookmark.categoryIds */
                    for (const bookmarkId of category.bookmarkIds) {
                        if (!bmm.bookmarkObjects[bookmarkId]) continue
                        bmm.bookmarkObjects[bookmarkId].categoryIds ??= [];
                        bmm.bookmarkObjects[bookmarkId].categoryIds.push(category.id);
                    }

                    /* populate tag.categoryIds */
                    for (const tagId of category.tagIds) {
                        if (!bmm.tagObjects[tagId]) continue
                        bmm.tagObjects[tagId].categoryIds ??= [];
                        bmm.tagObjects[tagId].categoryIds.push(category.id);
                    }

                    cursor.continue();
                };

                tx.oncomplete = () => resolve(bmm);
                tx.onerror = errResponse;
                tx.onabort = errResponse;
                request.onerror = errResponse;

                function errResponse(event: Event) {
                    reject(((event.target as IDBTransaction | IDBRequest<IDBCursorWithValue>).error));
                }
            });
        });
    },

    // Side effects - populates the input with tags objects
    async fillTags(bmm: IBMM) {
        return queueManager.enqueue(async () => {
            const db = await this.initializeDatabase();
            return new Promise<IBMM>((resolve, reject) => {
                const tx = db.transaction("tags", "readwrite");
                const store = tx.objectStore("tags");
                const request = store.openCursor();

                request.onsuccess = function onSuccess(event) {
                    const cursor = (event.target as IDBRequest<IDBCursorWithValue | null>).result;
                    if (!cursor) return void (0); /* No [more rows | rows found] */

                    const tag = cursor.value as ITag;
                    bmm.tagObjects[tag.id] = tag; // store the tag by its ID
                    bmm.tags.push(tag.id);

                    /* add to unlinked here */
                    if (tag.bookmarkIds.length === 0 && tag.categoryIds.length === 0) {
                        bmm.unlinked.tags.push(tag.id);
                    }

                    /* populate bookmark.tagIds */
                    for (const bookmarkId of tag.bookmarkIds) {
                        if (!bmm.bookmarkObjects[bookmarkId]) continue
                        bmm.bookmarkObjects[bookmarkId].tagIds ??= [];
                        bmm.bookmarkObjects[bookmarkId].tagIds.push(tag.id);
                    }

                    /* populate category.tagIds */
                    for (const tagId of tag.categoryIds) {
                        if (!bmm.categoryObjects[tagId]) continue
                        bmm.categoryObjects[tagId].tagIds ??= [];
                        bmm.categoryObjects[tagId].tagIds.push(tag.id);
                    }

                    cursor.continue();
                };

                tx.oncomplete = () => resolve(bmm);
                tx.onerror = errResponse;
                tx.onabort = errResponse;
                request.onerror = errResponse;

                function errResponse(event: Event) {
                    reject(((event.target as IDBTransaction | IDBRequest<IDBCursorWithValue>).error));
                }
            });
        });
    },
};
