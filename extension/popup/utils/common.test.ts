import { describe, expect, it, vi } from 'vitest';
import {
    categoriesSearch,
    categoryTagsSearch,
    dotIt,
    filterArchived,
    filterBy,
    fixTagDuplicates,
    getBookmarkCategories,
    getBookmarks,
    getCurrentTabTitle,
    getCurrentTabUrl,
    getTags,
    highlightTarget,
    isEmpty,
    resetHighlights,
    sortedBookmarks,
    sortedCategories,
    tagsSearch,
    weightedSearch
} from "./common";
import { IBookmark, ICategory, ITag } from "./types/schemas";


declare const global: any;

describe('common.ts', () => {
    describe('sortedBookmarks', () => {
        it('should sort bookmarks by updated_at in descending order', () => {
            const bookmarks: IBookmark[] = [
                { id: "1", title: 'Bookmark 1', created_at: '2023-01-01', updated_at: '2023-01-01', description: '', url: '', archived: 0, tags: [] },
                { id: "2", title: 'Bookmark 2', created_at: '2023-01-01', updated_at: '2023-01-03', description: '', url: '', archived: 0, tags: [] },
                { id: "3", title: 'Bookmark 3', created_at: '2023-01-01', updated_at: '2023-01-02', description: '', url: '', archived: 0, tags: [] },
            ];
            const sorted = sortedBookmarks(bookmarks);
            expect(sorted[0].id).toBe("2");
            expect(sorted[1].id).toBe("3");
            expect(sorted[2].id).toBe("1");
        });
    });

    describe('dotIt', () => {
        it('should prepend a dot to the class name if it does not already start with one', () => {
            expect(dotIt('className')).toBe('.className');
            expect(dotIt('.className')).toBe('.className');
            expect(dotIt('')).toBe('');
        });
    });

    describe('toggleHighlightedClass', () => {
        it('should toggle the highlighted class on the target element and remove it from other elements of the same type', () => {
            document.body.innerHTML = `
                <div class="category"></div>
                <div class="category highlighted"></div>
                <div class="category"></div>
            `;
            const target = document.querySelector('.category') as HTMLElement;
            highlightTarget(target, 'category');
            expect(target.classList.contains('highlighted')).toBe(true);
            expect(document.querySelectorAll('.highlighted').length).toBe(1);
        });
    });

    describe('resetSelections', () => {
        it('should reset selections based on the provided type', () => {
            document.body.innerHTML = `
                <div class="category selected"></div>
                <div class="category highlighted"></div>
                <div class="category"></div>
            `;
            resetHighlights('category');
            expect(document.querySelectorAll('.selected').length).toBe(1);
            expect(document.querySelectorAll('.highlighted').length).toBe(1);
        });
    });

    describe('sortedCategories', () => {
        it('should sort categories alphabetically by name and place the default category at the front', () => {
            const categories: ICategory[] = [
                { name: 'Beverages', is_default: 0, tags: [], bookmarks: [], id: "1", created_at: '', updated_at: '' },
                { name: 'Snacks', is_default: 1, tags: [], bookmarks: [], id: "2", created_at: '', updated_at: '' },
                { name: 'Dairy', is_default: 0, tags: [], bookmarks: [], id: "3", created_at: '', updated_at: '' }
            ];
            const sorted = sortedCategories(categories);
            expect(sorted[0].name).toBe('Snacks');
            expect(sorted[1].name).toBe('Beverages');
            expect(sorted[2].name).toBe('Dairy');
        });
    });

    describe('weightedSearch', () => {
        it('should perform a weighted search on an array of bookmarks', () => {
            const bookmarks: IBookmark[] = [
                { id: '1', title: 'Bookmark 1', description: 'Description 1', url: 'http://example.com/1', updated_at: '', archived: 0, created_at: '', tags: [] },
                { id: '2', title: 'Bookmark 2', description: 'Description 2', url: 'http://example.com/2', updated_at: '', archived: 0, created_at: '', tags: [] },
                { id: '3', title: 'Bookmark 3', description: 'Description 3', url: 'http://example.com/3', updated_at: '', archived: 0, created_at: '', tags: [] },
            ];
            const results = weightedSearch('Bookmark 2', bookmarks);
            expect(results.length).toBe(1);
            expect(results[0].id).toBe("2");
        });
    });

    describe('categoryTagsSearch', () => {
        it('should perform a weighted search on an array of categories based on tags', () => {
            const categories: ICategory[] = [
                { name: 'Category 1', is_default: 0, tags: [{ name: 'Tag 1', id: '', created_at: '', updated_at: '' }], bookmarks: [], created_at: '', updated_at: '', id: "1" },
                { name: 'Category 2', is_default: 0, tags: [{ name: 'Tag 2', id: '', created_at: '', updated_at: '' }], bookmarks: [], created_at: '', updated_at: '', id: "1" },
                { name: 'Category 3', is_default: 0, tags: [{ name: 'Tag 3', id: '', created_at: '', updated_at: '' }], bookmarks: [], created_at: '', updated_at: '', id: "1" },
            ];
            const results = categoryTagsSearch('Tag 2', categories);
            expect(results.length).toBe(1);
            expect(results[0].name).toBe('Category 2');
        });
    });

    describe('categoriesSearch', () => {
        it('should filter and sort categories based on a search query', () => {
            const categories: ICategory[] = [
                { name: 'Beverages', is_default: 0, tags: [], bookmarks: [], id: '', created_at: '', updated_at: '' },
                { name: 'Snacks', is_default: 0, tags: [], bookmarks: [], id: '', created_at: '', updated_at: '' },
                { name: 'Dairy', is_default: 0, tags: [], bookmarks: [], id: '', created_at: '', updated_at: '' },
            ];
            const results = categoriesSearch('Snacks', categories);
            expect(results.length).toBe(1);
            expect(results[0].name).toBe('Snacks');
        });
    });

    describe('getBookmarks', () => {
        it('should retrieve all bookmarks from the provided categories', () => {
            const categories: ICategory[] = [
                { name: 'Category 1', is_default: 0, id: '', created_at: '', updated_at: '', tags: [], bookmarks: [{ id: "1", title: 'Bookmark 1', description: '', url: '', updated_at: '', archived: 0, created_at: '', tags: [] }] },
                { name: 'Category 2', is_default: 0, id: '', created_at: '', updated_at: '', tags: [], bookmarks: [{ id: "2", title: 'Bookmark 2', description: '', url: '', updated_at: '', archived: 0, created_at: '', tags: [] }] }
            ];
            const bookmarks = getBookmarks(categories);
            expect(bookmarks.length).toBe(2);
        });
    });

    describe('getBookmarkCategories', () => {
        it('should retrieve the categories that contain the specified bookmark', () => {
            const categories: ICategory[] = [
                {
                    name: 'Category 1', is_default: 0, tags: [], bookmarks: [{
                        id: '1', title: 'Bookmark 1', description: '', url: '', updated_at: '', archived: 0,
                        created_at: "",
                        tags: []
                    }],
                    id: "",
                    created_at: "",
                    updated_at: ""
                },
                {
                    name: 'Category 2', is_default: 0, tags: [], bookmarks: [{
                        id: '2', title: 'Bookmark 2', description: '', url: '', updated_at: '', archived: 0,
                        created_at: "",
                        tags: []
                    }],
                    id: "",
                    created_at: "",
                    updated_at: ""
                }
            ];
            const bookmark: IBookmark = {
                id: "1", title: 'Bookmark 1', description: '', url: '', updated_at: '', archived: 0,
                created_at: "",
                tags: []
            };
            const results = getBookmarkCategories(bookmark, categories);
            expect(results.length).toBe(1);
            expect(results[0].name).toBe('Category 1');
        });
    });

    describe('filterArchived', () => {
        it('should filter out archived bookmarks from a list of categories', () => {
            const categories: ICategory[] = [
                {
                    name: 'Category 1', is_default: 0, tags: [], bookmarks: [{
                        id: "1", title: 'Bookmark 1', description: '', url: '', updated_at: '', archived: 1,
                        created_at: "",
                        tags: []
                    }],
                    id: "",
                    created_at: "",
                    updated_at: ""
                },
                {
                    name: 'Category 2', is_default: 0, tags: [], bookmarks: [{
                        id: "2", title: 'Bookmark 2', description: '', url: '', updated_at: '', archived: 0,
                        created_at: "",
                        tags: []
                    }],
                    id: "",
                    created_at: "",
                    updated_at: ""
                }
            ];
            const results = filterArchived(categories);
            expect(results.length).toBe(1);
            expect(results[0].id).toBe("1");
        });
    });

    describe('filterBy', () => {
        it('should filter an array of items based on a predicate function', () => {
            const items = [1, 2, 3, 4, 5];
            const predicate = (item: number) => item > 2;
            const results = filterBy(items, predicate);
            expect(results).toEqual([3, 4, 5]);
        });
    });

    describe('isEmpty', () => {
        it('should check if any of the specified properties in the given object are empty', () => {
            const obj = { prop1: 'value1', prop2: '', prop3: 'value3' };
            const props = ['prop1', 'prop2', 'prop3'] as (keyof typeof obj)[];
            const result = isEmpty(props, obj);
            expect(result).toBe('prop2');
        });
    });

    describe('getCurrentTabUrl', () => {
        it('should retrieve the URL of the current tab in the browser', async () => {
            global.chrome = {
                tabs: {
                    query: vi.fn().mockResolvedValue([{ url: 'http://example.com' }])
                }
            };
            const url = await getCurrentTabUrl();
            expect(url).toBe('http://example.com');
        });
    });

    describe('getCurrentTabTitle', () => {
        it('should retrieve the title of the current tab in the browser', async () => {
            global.chrome = {
                tabs: {
                    query: vi.fn().mockResolvedValue([{ title: 'Example Title' }])
                }
            };
            const title = await getCurrentTabTitle();
            expect(title).toBe('Example Title');
        });
    });

    describe('getTags', () => {
        it('should extract and return an array of tags from the given categories', () => {
            const categories: ICategory[] = [
                {
                    name: 'Category 1', is_default: 0, tags: [{
                        name: 'Tag 1',
                        id: "",
                        created_at: "",
                        updated_at: ""
                    }], bookmarks: [],
                    id: "",
                    created_at: "",
                    updated_at: ""
                },
                {
                    name: 'Category 2', is_default: 0, tags: [{
                        name: 'Tag 2',
                        id: "",
                        created_at: "",
                        updated_at: ""
                    }], bookmarks: [],
                    id: "",
                    created_at: "",
                    updated_at: ""
                }
            ];
            const tags = getTags(categories);
            expect(tags.length).toBe(2);
        });
    });

    describe('fixTagDuplicates', () => {
        it('should remove duplicate tags from an array and sort them by name', () => {
            const tags: ITag[] = [
                {
                    name: 'Tag 1',
                    id: "",
                    created_at: "",
                    updated_at: ""
                },
                {
                    name: 'Tag 2',
                    id: "",
                    created_at: "",
                    updated_at: ""
                },
                {
                    name: 'Tag 1',
                    id: "",
                    created_at: "",
                    updated_at: ""
                }
            ];
            const uniqueTags = fixTagDuplicates(tags);
            expect(uniqueTags.length).toBe(2);
            expect(uniqueTags[0].name).toBe('Tag 1');
            expect(uniqueTags[1].name).toBe('Tag 2');
        });
    });

    describe('tagsSearch', () => {
        it('should filter and sort an array of tags based on a search query', () => {
            const categories: ICategory[] = [
                {
                    name: 'Category 1', is_default: 0, tags: [{
                        name: 'Tag 1',
                        id: "",
                        created_at: "",
                        updated_at: ""
                    }], bookmarks: [],
                    id: "",
                    created_at: "",
                    updated_at: ""
                },
                {
                    name: 'Category 2', is_default: 0, tags: [{
                        name: 'Tag 2',
                        id: "",
                        created_at: "",
                        updated_at: ""
                    }], bookmarks: [],
                    id: "",
                    created_at: "",
                    updated_at: ""
                }
            ];
            const results = tagsSearch('Tag 1', categories);
            expect(results.length).toBe(1);
            expect(results[0].name).toBe('Tag 1');
        });
    });
});
