import Header from '../components/HeaderBar/Header'
import SideBar from '../components/SideBar/SideBar'
import ContentBar from '../components/ContentBar/ContentBar'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { ICategory } from '../utils/types/schemas'
import { update } from '../utils/crud'

type IHomeProps = {
    data: ICategory[];
    setData: Dispatch<SetStateAction<ICategory[]>>;
}

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

    console.log(data.map((cat) => cat.name));


    return (
        <>
            <Header
                selectedCategory={selectedCategory}
                setData={setData}
                categories={data}
                defaultCategory={defaultCategory}
            >
            </Header>
            <section>
                <SideBar
                    selectedCategory={selectedCategory}
                    updateCategory={updateCategory}
                    setSelectedCategory={setSelectedCategory}
                    categories={data}
                    setData={setData}
                    defaultCategory={defaultCategory}>
                </SideBar>
                <ContentBar
                    updateCategory={updateCategory}
                    selectedCategory={selectedCategory}
                    data={data}>
                </ContentBar>
            </section>
        </>
    )
}
