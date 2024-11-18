// BookMark Interface
export type TBookmark = {
    id: number;
    title: string;
    description: string;
    url: string;
    updated: string;
}

// ICategory interface
export type TCategory = {
    name: string;
    bookmarks: TBookmark[];
}

// ICategories type - An array of ICategory
export type TCategories = TCategory[];

// TBookmarks type - An array of IBookmark
export type TBookmarks = TBookmark[];
