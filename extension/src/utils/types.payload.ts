// BookMark Interface
export type TBookmark = {
    id: number;
    title: string;
    description: string;
    url: string;
    updated: string;
};

export type TCRUD = {
    create: (categories: TCategory[], category: TCategory) => TCategory[];
    read: (categories: TCategory[]) => TCategory[];
    update: (categories: TCategory[], category: TCategory) => TCategory[];
    delete: (categories: TCategory[], category: TCategory) => TCategory[];
};

// ICategory interface
export type TCategory = {
    name: string;
    bookmarks: TBookmark[];
};
