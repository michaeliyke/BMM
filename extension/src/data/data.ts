import { v4 as uuidv4 } from "uuid";
import { IBookmark, ICategory, ITag } from "../utils/types/schemas";

/**
 * An array of tag objects, each representing a tag with a unique identifier, name, and timestamps for creation and last update.
 *
 * @type {ITag[]}
 * @property {string} id - The unique identifier for the tag, generated using uuidv4.
 * @property {string} name - The name of the tag.
 * @property {string} updated_at - The timestamp indicating when the tag was last updated.
 * @property {string} created_at - The timestamp indicating when the tag was created.
 */
const tags: ITag[] = [
    {
        id: uuidv4(),
        name: "Google",
        updated_at: "2021-09-01",
        created_at: "2021-09-01",
    },
    {
        id: uuidv4(),
        name: "Career",
        updated_at: "2021-09-01",
        created_at: "2021-09-01",
    },
    {
        id: uuidv4(),
        name: "Certificates",
        updated_at: "2021-09-01",
        created_at: "2021-09-01",
    },
    {
        id: uuidv4(),
        name: "Grow-w-Google",
        updated_at: "2021-09-01",
        created_at: "2021-09-01",
    },
    {
        id: uuidv4(),
        name: "Googles",
        updated_at: "2021-09-01",
        created_at: "2021-09-01",
    },
    {
        id: uuidv4(),
        name: "Goo.gle",
        updated_at: "2021-09-01",
        created_at: "2021-09-01",
    },
];

/**
 * An array of bookmark objects, each representing a bookmarked resource.
 *
 * Each bookmark object contains the following properties:
 * - `id`: A unique identifier for the bookmark, generated using `uuidv4()`.
 * - `title`: The title of the bookmarked resource.
 * - `description`: A brief description of the bookmarked resource.
 * - `url`: The URL of the bookmarked resource.
 * - `updated_at`: The date when the bookmark was last updated, in the format "YYYY-MM-DD".
 * - `created_at`: The date when the bookmark was created, in the format "YYYY-MM-DD".
 * - `tags`: An array of tags associated with the bookmark, which can be a subset of the `tags` array.
 */
const bookmarks: IBookmark[] = [
    {
        id: uuidv4(),
        title: "Google Career Certificates",
        description: "Google Career Certificates are part of Grow with Google, an initiative that draws on Google's 20-year history of building products, platforms, and services that help people and businesses grow.",
        url: "https://grow.google/certificates/",
        updated_at: "2021-09-01",
        created_at: "2021-09-01",
        tags: tags.slice(4, 6),
    },
    {
        id: uuidv4(),
        title: "Google Career Certificates",
        description: "Google Career Certificates are part of Grow with Google, an initiative that draws on Google's 20-year history of building products, platforms, and services that help people and businesses grow.",
        url: "https://grow.google/certificates/",
        updated_at: "2021-09-01",
        created_at: "2021-09-01",
        tags: tags.slice(0, 2),
    },
    {
        id: uuidv4(),
        title: "Google Career Certificates",
        description: "Google Career Certificates are part of Grow with Google, an initiative that draws on Google's 20-year history of building products, platforms, and services that help people and businesses grow.",
        url: "https://grow.google/certificates/",
        updated_at: "2021-09-01",
        created_at: "2021-09-01",
        tags: tags.slice(-3),
    },
    {
        id: uuidv4(),
        title: "Google Career Certificates",
        description: "Google Career Certificates are part of Grow with Google, an initiative that draws on Google's 20-year history of building products, platforms, and services that help people and businesses grow.",
        url: "https://grow.google/certificates/",
        updated_at: "2021-09-01",
        created_at: "2021-09-01",
        tags: [],
    },
];

/**
 * An array of category objects, each representing a category with its associated properties.
 *
 * @type {ICategory[]}
 *
 * @property {string} id - A unique identifier for the category, generated using `uuidv4()`.
 * @property {number} is_default - Indicates whether the category is the default category (1 for true, 0 for false).
 * @property {string} name - The name of the category.
 * @property {IBookmark[]} bookmarks - An array of bookmarks associated with the category.
 * @property {string} updated_at - The date when the category was last updated, in the format "YYYY-MM-DD".
 * @property {string} created_at - The date when the category was created, in the format "YYYY-MM-DD".
 * @property {ITag[]} tags - An array of tags associated with the category, sliced from the `tags` array.
 */
const categories: ICategory[] = [
    {
        id: uuidv4(),
        is_default: 1,
        name: "Default Category",
        bookmarks: bookmarks,
        updated_at: "2021-09-01",
        created_at: "2021-09-01",
        tags: tags.slice(0, 2),
    },
    {
        id: uuidv4(),
        is_default: 0,
        name: "Programming Languages",
        bookmarks: bookmarks,
        updated_at: "2021-09-01",
        created_at: "2021-09-01",
        tags: tags.slice(2, 4),
    },
    {
        id: uuidv4(),
        is_default: 0,
        name: "Frontend Space",
        bookmarks: bookmarks,
        updated_at: "2021-09-01",
        created_at: "2021-09-01",
        tags: [],
    },
    {
        id: uuidv4(),
        is_default: 0,
        name: "Backend Space",
        bookmarks: bookmarks,
        updated_at: "2021-09-01",
        created_at: "2021-09-01",
        tags: tags.slice(4, 6),
    },

    {
        id: uuidv4(),
        is_default: 0,
        name: "The Physical World",
        bookmarks: bookmarks,
        updated_at: "2021-09-01",
        created_at: "2021-09-01",
        tags: [],
    },
    {
        id: uuidv4(),
        is_default: 0,
        name: "Career Solutions",
        bookmarks: bookmarks,
        updated_at: "2021-09-01",
        created_at: "2021-09-01",
        tags: tags.slice(0, 2),
    },
    {
        id: uuidv4(),
        is_default: 0,
        name: "Programming World",
        bookmarks: bookmarks,
        updated_at: "2021-09-01",
        created_at: "2021-09-01",
        tags: [],
    },
    {
        id: uuidv4(),
        is_default: 0,
        name: "Frontend",
        bookmarks: bookmarks,
        updated_at: "2021-09-01",
        created_at: "2021-09-01",
        tags: tags.slice(2, 4),
    },
    {
        id: uuidv4(),
        is_default: 0,
        name: "Backend Engineering",
        bookmarks: bookmarks,
        updated_at: "2021-09-01",
        created_at: "2021-09-01",
        tags: [],
    },
    {
        id: uuidv4(),
        is_default: 0,
        name: "Human Emotions",
        bookmarks: bookmarks,
        updated_at: "2021-09-01",
        created_at: "2021-09-01",
        tags: tags.slice(4, 6),
    },
    {
        id: uuidv4(),
        is_default: 0,
        name: "Career Paths",
        bookmarks: bookmarks,
        updated_at: "2021-09-01",
        created_at: "2021-09-01",
        tags: [],
    },
    {
        id: uuidv4(),
        is_default: 0,
        name: "Programming",
        bookmarks: bookmarks,
        updated_at: "2021-09-01",
        created_at: "2021-09-01",
        tags: tags.slice(0, 2),
    },
    {
        id: uuidv4(),
        is_default: 0,
        name: "Frontend World",
        bookmarks: bookmarks,
        updated_at: "2021-09-01",
        created_at: "2021-09-01",
        tags: [],
    },
    {
        id: uuidv4(),
        is_default: 0,
        name: "Backend",
        bookmarks: bookmarks,
        updated_at: "2021-09-01",
        created_at: "2021-09-01",
        tags: tags.slice(2, 4),
    },
    {
        id: uuidv4(),
        is_default: 0,
        name: "Human World",
        bookmarks: bookmarks,
        updated_at: "2021-09-01",
        created_at: "2021-09-01",
        tags: tags.slice(4, 6),
    },

];

export default categories;
