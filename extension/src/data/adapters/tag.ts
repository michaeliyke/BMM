import { ITag } from "../../utils/types/schemas";
import { Operator } from "../operator";

export default {
    /**
     * Creates a new tag record in the database if it does not already exist.
     *
     * @param {ITag} tag - The tag object to be created.
     * @returns {Promise<void>} A promise that resolves when the tag has been created.
     */
    async createTag(tag: ITag): Promise<void> {
        // Create a new tag record in the database if not exists
        if (!(await Operator.getRecordByIndex<ITag>('tags', 'tags_index', tag.id)))
            await Operator.createRecord<ITag>('tags', tag);
    },

    /**
     * Updates an existing tag in the database.
     *
     * @param {ITag} updatedTag - The tag object containing updated information.
     * @returns {Promise<void>} A promise that resolves when the tag is successfully updated.
     * @throws {Error} Throws an error if the tag does not exist.
     */
    async updateTag(updatedTag: ITag): Promise<void> {
        if (await Operator.getRecordByIndex("tags", "tags_index", updatedTag.id)) {
            await Operator.updateRecord<ITag>('tags', updatedTag, updatedTag.id);
            return;
        }
        throw new Error("Tag does not exist: " + updatedTag.id);
    },

    /**
     * Deletes a tag and removes all references to it.
     *
     * @param tagId - The ID of the tag to delete.
     * @returns A promise that resolves when the tag and all its references have been deleted.
     * @throws An error if the tag with the specified ID is not found.
     */
    async deleteTag(tagId: string): Promise<void> {
        // Ensure tag exists
        if (!(await Operator.getRecordByIndex<ITag>('tags', 'tags_index', tagId)))
            throw new Error(`Tag with id ${tagId} not found`);

        // Delete all category_tags references to the tag
        const query = IDBKeyRange.bound(["", tagId], ['\uffff', tagId]);
        await Operator.deleteRecordsByIndex("category_tags", "category_tags_index", query);

        // Delete all bookmark_tags references to the tag
        await Operator.deleteRecordsByIndex("bookmark_tags", "bookmark_tags_index", query);

        // Delete the tag itself
        await Operator.deleteRecord('tags', tagId);
    },

    /**
     * Retrieves a list of tags from the database.
     *
     * @returns {Promise<ITag[]>} A promise that resolves to an array of tags.
     */
    async getTags(): Promise<ITag[]> {
        return await Operator.getRecordsByIndex<ITag>('tags', 'tags_index');
    },

    /**
     * Retrieves a tag by its unique identifier.
     *
     * @param id - The unique identifier of the tag to retrieve.
     * @returns A promise that resolves to the tag object.
     */
    async getTagById(id: string): Promise<ITag> {
        return await Operator.getRecordByIndex<ITag>('tags', 'tags_index', id);
    },
};
