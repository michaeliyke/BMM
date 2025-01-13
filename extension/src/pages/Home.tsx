import Header from '../components/HeaderBar/Header'
import SideBar from '../components/SideBar/SideBar'
import ContentBar from '../components/ContentBar/ContentBar'
import { useEffect, useState } from 'react'
import { IBookmark, ICategory, ITag } from '../utils/types/schemas'
import { update } from '../utils/crud'
import { IHomeProps } from '../utils/types/props'

const _defaultCategory = {
    id: 'dummy-id',
    name: 'No Category Selected',
    is_default: 0,
    created_at: (new Date()).toUTCString(),
    updated_at: (new Date()).toUTCString(),
    tags: [],
    bookmarks: []
};


export default function Home(props: IHomeProps) {
    const { data, setData } = props;
    const [selectedCategory, setSelectedCategory] = useState<ICategory | null>(null);
    const [defaultCategory, setDefaultCategory] = useState<ICategory>(_defaultCategory);
    const [bookmarkToShow, setBookmarkToShow] = useState<IBookmark | null>(null);
    const [selectedTag, setSelectedTag] = useState<ITag | null>(null);
    const [grouping, setGrouping] = useState(
        (selectedCategory || defaultCategory).name +
        (selectedTag ? ` # ${selectedTag.name}` : '')
    );
    const [filterBy, setFilterBy] = useState('categories');
    const [filteredCategories, setFilteredCategories] = useState<ICategory[]>([]);
    const [bookmarks, setBookmarks] = useState<IBookmark[]>([]);
    const [query, setQuery] = useState("");

    // Update a single category of the category list identified by its name
    function updateCategory(updatedCategory: ICategory) {
        setData((prevCategories) => update(prevCategories, updatedCategory));
    }

    useEffect(() => {
        for (const category of data) {
            if (category.is_default === 1) {
                setDefaultCategory(category);
            }
        }
    }, [data]);

    return (
        <>
            <Header
                selectedCategory={selectedCategory}
                setData={setData}
                categories={data}
                defaultCategory={defaultCategory}
                grouping={grouping}
                setGrouping={setGrouping}
                selectedTag={selectedTag}
                filterBy={filterBy}
            />

            <section>
                <SideBar
                    props={{
                        categories: data,
                        setData,
                        selectedCategory,
                        setSelectedCategory,
                        defaultCategory,
                        bookmarkToShow,
                        setBookmarkToShow,
                        updateCategory,
                        selectedTag,
                        setSelectedTag,
                        setGrouping,
                        filterBy,
                        setFilterBy,
                        bookmarks,
                        setBookmarks,
                        filteredCategories,
                        setFilteredCategories,
                        query,
                        setQuery,
                    }}
                />

                <ContentBar
                    updateCategory={updateCategory}
                    selectedCategory={selectedCategory}
                    data={data}
                    bookmarkToShow={bookmarkToShow}
                    setBookmarkToShow={setBookmarkToShow}
                    selectedTag={selectedTag}
                    setSelectedTag={setSelectedTag}
                    bookmarks={bookmarks}
                    setBookmarks={setBookmarks}
                    filteredCategories={filteredCategories}
                    setFilteredCategories={setFilteredCategories}
                    query={query}
                    setQuery={setQuery}
                    grouping={grouping}
                />
            </section>
        </>
    )
}
