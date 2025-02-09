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
        id: '0',
        name: "Coals",
        updated_at: "2021-09-01T00:00:00.000Z",
        created_at: "2021-09-01T00:00:00.000Z",
    },
    {
        id: '1',
        name: "Scamble",
        updated_at: "2021-09-01T00:00:00.000Z",
        created_at: "2021-09-01T00:00:00.000Z",
    },
    {
        id: '2',
        name: "Steam",
        updated_at: "2021-09-01T00:00:00.000Z",
        created_at: "2021-09-01T00:00:00.000Z",
    },
    {
        id: '3',
        name: "Hots",
        updated_at: "2021-09-01T00:00:00.000Z",
        created_at: "2021-09-01T00:00:00.000Z",
    },
    {
        id: '4',
        name: "Muses",
        updated_at: "2021-09-01T00:00:00.000Z",
        created_at: "2021-09-01T00:00:00.000Z",
    },
    {
        id: '5',
        name: "Rants",
        updated_at: "2021-09-01T00:00:00.000Z",
        created_at: "2021-09-01T00:00:00.000Z",
    },
];

// Tags 1-6 named through destructred array assignment
const [t1, t2, t3, t4, t5, t6] = tags;

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
        id: '0',
        title: "One - Google Career Certificates",
        description: "Google Career Certificates are part of Grow with Google, an initiative that draws on Google's 20-year history of building products, platforms, and services that help people and businesses grow.",
        url: "https://grow.google/certificates/",
        updated_at: "2021-09-01T00:00:00.000Z",
        created_at: "2021-09-01T00:00:00.000Z",
        tags: tags.slice(4, 6),
        archived: 0,
    },
    {
        id: '1',
        title: "Two - Google Career Certificates",
        description: "Google Career Certificates are part of Grow with Google, an initiative that draws on Google's 20-year history of building products, platforms, and services that help people and businesses grow.",
        url: "https://grow.google/certificates/",
        updated_at: "2021-09-01T00:00:00.000Z",
        created_at: "2021-09-01T00:00:00.000Z",
        tags: tags.slice(0, 2),
        archived: 0,
    },
    {
        id: '2',
        title: "Three - Google Career Certificates",
        description: "Google Career Certificates are part of Grow with Google, an initiative that draws on Google's 20-year history of building products, platforms, and services that help people and businesses grow.",
        url: "https://grow.google/certificates/",
        updated_at: "2021-09-01T00:00:00.000Z",
        created_at: "2021-09-01T00:00:00.000Z",
        tags: tags.slice(4, 6),
        archived: 0,
    },
    {
        id: '3',
        title: "Four - Google Career Certificates",
        description: "Google Career Certificates are part of Grow with Google, an initiative that draws on Google's 20-year history of building products, platforms, and services that help people and businesses grow.",
        url: "https://grow.google/certificates/",
        updated_at: "2021-09-01T00:00:00.000Z",
        created_at: "2021-09-01T00:00:00.000Z",
        tags: tags.slice(4, 6),
        archived: 0,
    },
    {
        id: '4',
        title: "Five - Michael and his Career",
        description: "Michael is a software engineer with a passion for learning and growth. He shares his insights on career development and the tech industry.",
        url: "https://michaelcareers.com/",
        updated_at: "2021-09-01T00:00:00.000Z",
        created_at: "2021-09-01T00:00:00.000Z",
        tags: tags.slice(1, 3),
        archived: 0,
    },
    {
        id: '5',
        title: "Six - Michael's Biography",
        description: "Michael is a software engineer with a passion for learning and growth. He shares his insights on career development and the tech industry.",
        url: "https://michaelcareers.com/",
        updated_at: "2021-09-01T00:00:00.000Z",
        created_at: "2021-09-01T00:00:00.000Z",
        tags: tags.slice(1, 3),
        archived: 0,
    },
    {
        id: '6',
        title: "Seven - Michael's Career",
        description: "Michael is a software engineer with a passion for learning and growth. He shares his insights on career development and the tech industry.",
        url: "https://michaelcareers.com/",
        updated_at: "2021-09-01T00:00:00.000Z",
        created_at: "2021-09-01T00:00:00.000Z",
        tags: tags.slice(1, 3),
        archived: 0,
    },
    {
        id: '7',
        title: "Eight - Michael's Biography",
        description: "Michael is a software engineer with a passion for learning and growth. He shares his insights on career development and the tech industry.",
        url: "https://michaelcareers.com/",
        updated_at: "2021-09-01T00:00:00.000Z",
        created_at: "2021-09-01T00:00:00.000Z",
        tags: tags.slice(1, 3),
        archived: 0,
    },
];

// Bookmarks 1-4 named through destructred array assignment
const [b1, b2, b3, b4, b5, b6, b7, b8] = bookmarks;

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
        id: '0',
        is_default: 1,
        name: "Default Category",
        bookmarks: [b1, b2],
        updated_at: "2021-09-01T00:00:00.000Z",
        created_at: "2021-09-01T00:00:00.000Z",
        tags: [t1, t2],
    },
    {
        id: '1',
        is_default: 0,
        name: "Programming Languages",
        bookmarks: [b3, b4],
        updated_at: "2021-09-01T00:00:00.000Z",
        created_at: "2021-09-01T00:00:00.000Z",
        tags: [t3, t4],
    },
    {
        id: '2',
        is_default: 0,
        name: "Frontend Space",
        bookmarks: [b5, b6],
        updated_at: "2021-09-01T00:00:00.000Z",
        created_at: "2021-09-01T00:00:00.000Z",
        tags: [t5, t6],
    },
    {
        id: '3',
        is_default: 0,
        name: "Backend Space",
        bookmarks: [b7, b8],
        updated_at: "2021-09-01T00:00:00.000Z",
        created_at: "2021-09-01T00:00:00.000Z",
        tags: [t1, t2],
    },

    {
        id: '4',
        is_default: 0,
        name: "The Physical World",
        bookmarks: [b1, b2],
        updated_at: "2021-09-01T00:00:00.000Z",
        created_at: "2021-09-01T00:00:00.000Z",
        tags: [t3, t4],
    },
    {
        id: '5',
        is_default: 0,
        name: "Career Solutions",
        bookmarks: [b3, b4],
        updated_at: "2021-09-01T00:00:00.000Z",
        created_at: "2021-09-01T00:00:00.000Z",
        tags: [t5, t6],
    },
    {
        id: '6',
        is_default: 0,
        name: "Programming World",
        bookmarks: [b5, b6],
        updated_at: "2021-09-01T00:00:00.000Z",
        created_at: "2021-09-01T00:00:00.000Z",
        tags: [t1, t2],
    },
    {
        id: '7',
        is_default: 0,
        name: "Frontend",
        bookmarks: [b7, b8],
        updated_at: "2021-09-01T00:00:00.000Z",
        created_at: "2021-09-01T00:00:00.000Z",
        tags: [t3, t4],
    },
    {
        id: '8',
        is_default: 0,
        name: "Backend Engineering",
        bookmarks: [b1, b2],
        updated_at: "2021-09-01T00:00:00.000Z",
        created_at: "2021-09-01T00:00:00.000Z",
        tags: [],
    },
    {
        id: '9',
        is_default: 0,
        name: "Human Emotions",
        bookmarks: [b3, b4],
        updated_at: "2021-09-01T00:00:00.000Z",
        created_at: "2021-09-01T00:00:00.000Z",
        tags: [t5, t6],
    },
    {
        id: '10',
        is_default: 0,
        name: "Career Paths",
        bookmarks: [b5, b6],
        updated_at: "2021-09-01T00:00:00.000Z",
        created_at: "2021-09-01T00:00:00.000Z",
        tags: [t1, t2],
    },
    {
        id: '11',
        is_default: 0,
        name: "Programming",
        bookmarks: [b7, b8],
        updated_at: "2021-09-01T00:00:00.000Z",
        created_at: "2021-09-01T00:00:00.000Z",
        tags: [t3, t4],
    },
    {
        id: '12',
        is_default: 0,
        name: "Frontend World",
        bookmarks: [b1, b2],
        updated_at: "2021-09-01T00:00:00.000Z",
        created_at: "2021-09-01T00:00:00.000Z",
        tags: [t5, t6],
    },
    {
        id: '13',
        is_default: 0,
        name: "Backend",
        bookmarks: [b3, b4],
        updated_at: "2021-09-01T00:00:00.000Z",
        created_at: "2021-09-01T00:00:00.000Z",
        tags: [t1, t2],
    },
    {
        id: '14',
        is_default: 0,
        name: "Human World",
        bookmarks: [b5, b6],
        updated_at: "2021-09-01T00:00:00.000Z",
        created_at: "2021-09-01T00:00:00.000Z",
        tags: [t3, t4, t5, t6],
    },

];

export default categories;
