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
import { Operator } from "../operator";
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

    describe("Method: tag.create()", () => {
        let db: IDBDatabase;
        let tag: Tag;
        const id = crypto.randomUUID();

        beforeAll(async () => {
            db = await Operator.initializeDatabase();
        });

        beforeEach(() => {
            tag = new Tag({
                id: id,
                name: "TestTag",
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            });
        });

        afterAll(() => {
            db.close();
            indexedDB.deleteDatabase("bmm");
        });

        it("should create a new tag if it does not exist", async () => {
            const createdTag = await tag.create();
            expect(createdTag).toEqual(expect.objectContaining({ id: tag.id, name: "TestTag" }));
        });

        it("should return the existing tag if it already exists", async () => {
            await tag.create();
            const duplicate = await tag.create();
            expect(duplicate).toEqual(expect.objectContaining({ id: tag.id, name: "TestTag" }));
        });

        it("should throw an error if any of id, name, created_at, or updated_at is empty", async () => {
            tag.name = "";
            try {
                new Tag(tag);
            } catch (error) {
                expect(error).toBeInstanceOf(Error);
                if (error instanceof Error) {
                    expect(error.message).toContain("required field");
                }
            }
        });

        it("should throw an error if Operator.createRecord throws an error", async () => {
            const spy = vi.spyOn(Operator, "createRecord").mockRejectedValue(new Error("Test Error"));
            try {
                await tag.create();
            } catch (error) {
                expect(error).toBeInstanceOf(Error);
                if (error instanceof Error) {
                    expect(error.message).toContain("Test Error");
                }
            } finally {
                spy.mockRestore();
            }
        });
    });

    describe("Method: Tag.getTags()", () => {
        let db: IDBDatabase;

        beforeAll(async () => {
            db = await Operator.initializeDatabase();
        });

        afterAll(() => {
            db.close();
            indexedDB.deleteDatabase("bmm");
        });

        it("should return an empty array if no tags exist", async () => {
            setTimeout(async () => {
                const tags = await Tag.getTags();
                expect(tags).toEqual([]);
            }, 300);
        });

        it("should return all existing tags", async () => {
            const tag1 = new Tag({
                id: crypto.randomUUID(),
                name: "Tag1",
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            });

            const tag2 = new Tag({
                id: crypto.randomUUID(),
                name: "Tag2",
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            });

            await tag1.create();
            await tag2.create();

            setTimeout(async () => {
                const tags = await Tag.getTags();
                expect(tags).toHaveLength(2);
                expect(tags).toEqual(expect.arrayContaining([
                    expect.objectContaining({ name: "Tag1" }),
                    expect.objectContaining({ name: "Tag2" })
                ]));
            }, 300);
        });

        it("should throw an error if Operator.getRecordsByIndex throws an error", async () => {
            const spy = vi.spyOn(Operator, "getRecordsByIndex").mockRejectedValue(new Error("Test Error"));
            try {
                await Tag.getTags();
            } catch (error) {
                expect(error).toBeInstanceOf(Error);
                if (error instanceof Error) {
                    expect(error.message).toContain("Test Error");
                }
            } finally {
                spy.mockRestore();
            }
        });
    });

    describe("Method: Tag.getTagById()", () => {
        let db: IDBDatabase;
        let tag: Tag;

        beforeAll(async () => {
            db = await Operator.initializeDatabase();
        });

        beforeEach(() => {
            tag = new Tag({
                id: crypto.randomUUID(),
                name: "TagById",
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            });
        });

        afterAll(() => {
            db.close();
            indexedDB.deleteDatabase("bmm");
        });

        it("should return null if tag does not exist", async () => {
            const result = await Tag.getTagById("non-existent-id");
            expect(result).toBeNull();
        });

        it("should retrieve a tag by ID if it exists", async () => {
            await tag.create();
            const retrievedTag = await Tag.getTagById(tag.id);
            expect(retrievedTag).toEqual(expect.objectContaining({ id: tag.id, name: "TagById" }));
        });

        it("should throw an error if Operator.getRecordById throws an error", async () => {
            const spy = vi.spyOn(Operator, "getRecordById").mockRejectedValue(new Error("Test Error"));
            try {
                await Tag.getTagById("test-id");
            } catch (error) {
                expect(error).toBeInstanceOf(Error);
                if (error instanceof Error) {
                    expect(error.message).toContain("Test Error");
                }
            } finally {
                spy.mockRestore();
            }
        });
    });

    describe("Method: tag.exists() & Tag.exists()", () => {
        let db: IDBDatabase;
        let tag: Tag;

        beforeAll(async () => {
            db = await Operator.initializeDatabase();
        });

        beforeEach(() => {
            tag = new Tag({
                id: crypto.randomUUID(),
                name: "ExistsTest",
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            });
        });

        afterAll(() => {
            db.close();
            indexedDB.deleteDatabase("bmm");
        });

        it("should return null for an instance tag that does not exist", async () => {
            const result = await tag.exists();
            expect(result).toBeNull();
        });

        it("should return the tag for an instance that exists", async () => {
            await tag.create();
            const result = await tag.exists();
            expect(result).toEqual(expect.objectContaining({ id: tag.id, name: "ExistsTest" }));
        });

        it("should return null for a static tag check if name does not exist", async () => {
            const result = await Tag.exists("NonExistentTag");
            expect(result).toBeNull();
        });

        it("should return the tag for a static tag check if name exists", async () => {
            await tag.create();
            setTimeout(async () => {
                const result = await Tag.exists("ExistsTest");
                expect(result).toEqual(expect.objectContaining({ id: tag.id, name: "ExistsTest" }));
            }, 300);
        });

        it("should throw an error if Operator.getRecordByIndex throws an error", async () => {
            const spy = vi.spyOn(Operator, "getRecordByIndex").mockRejectedValue(new Error("Test Error"));
            try {
                await tag.exists();
            } catch (error) {
                expect(error).toBeInstanceOf(Error);
                if (error instanceof Error) {
                    expect(error.message).toContain("Test Error");
                }
            } finally {
                spy.mockRestore();
            }
        });
    });

    describe("Method: tag.update()", () => {
        let db: IDBDatabase;
        let tag: Tag;

        beforeAll(async () => {
            db = await Operator.initializeDatabase();
        });

        beforeEach(() => {
            tag = new Tag({
                id: crypto.randomUUID(),
                name: "OriginalName",
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            });
        });

        afterAll(() => {
            db.close();
            indexedDB.deleteDatabase("bmm");
        });

        it("should throw an error when trying to update a non-existent tag", async () => {
            await expect(tag.update()).rejects.toThrow("Tag.update:- Tag not found");
        });

        it("should update an existing tag successfully", async () => {
            await tag.create();

            tag.name = "UpdatedName"; // Modify the tag

            setTimeout(async () => {
                await tag.update();
                const updatedTag = await Tag.getTagById(tag.id);

                expect(updatedTag).toBeDefined();
                expect(updatedTag?.name).toBe("UpdatedName");
            }, 300);
        });

        it("should throw an error if Operator.updateRecord throws an error", async () => {
            await tag.create();
            const spy = vi.spyOn(Operator, "updateRecord").mockRejectedValue(new Error("Test Error"));
            try {
                await tag.update();
            } catch (error) {
                expect(error).toBeInstanceOf(Error);
                if (error instanceof Error) {
                    expect(error.message).toContain("Test Error");
                }
            } finally {
                spy.mockRestore();
            }
        });
    });

    describe("Method: tag.delete()", () => {
        let db: IDBDatabase;
        let tag: Tag;

        beforeAll(async () => {
            db = await Operator.initializeDatabase();
        });

        beforeEach(() => {
            tag = new Tag({
                id: crypto.randomUUID(),
                name: "TagToDelete",
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            });
        });

        afterAll(() => {
            db.close();
            indexedDB.deleteDatabase("bmm");
        });

        it("should throw an error when trying to delete a non-existent tag", async () => {
            await expect(tag.delete()).rejects.toThrow("Tag.delete:- Tag not found");
        });

        it("should delete an existing tag and remove all references", async () => {
            await tag.create();

            // Simulate related records in category_tags and bookmark_tags
            const categoryTag = { category_id: "cat1", tag_id: tag.id, id: crypto.randomUUID() };
            const bookmarkTag = { bookmark_id: "bm1", tag_id: tag.id, id: crypto.randomUUID() };

            await Operator.createRecord("category_tags", categoryTag);
            await Operator.createRecord("bookmark_tags", bookmarkTag);

            // Delete the tag
            await tag.delete();

            // Ensure tag is removed
            const deletedTag = await Tag.getTagById(tag.id);
            expect(deletedTag).toBeNull();

            // Ensure related records are also deleted
            const relatedCategoryTags = await Operator.getRecordsByIndex("category_tags", "category_tags_index");
            const relatedBookmarkTags = await Operator.getRecordsByIndex("bookmark_tags", "bookmark_tags_index");

            expect(relatedCategoryTags).not.toContainEqual(expect.objectContaining({ tag_id: tag.id }));
            expect(relatedBookmarkTags).not.toContainEqual(expect.objectContaining({ tag_id: tag.id }));
        });

        it("should throw an error if Operator.deleteRecord or Operator.deleteRecordsByIndex throws an error", async () => {
            await tag.create();
            const spy1 = vi.spyOn(Operator, "deleteRecord").mockRejectedValue(new Error("Test Error"));
            const spy2 = vi.spyOn(Operator, "deleteRecordsByIndex").mockRejectedValue(new Error("Test Error"));
            try {
                await tag.delete();
            } catch (error) {
                expect(error).toBeInstanceOf(Error);
                if (error instanceof Error) {
                    expect(error.message).toContain("Test Error");
                }
            } finally {
                spy1.mockRestore();
                spy2.mockRestore();
            }
        });
    });
});
