import Header from '../components/HeaderBar/Header'
import SideBar from '../components/SideBar/SideBar'
import ContentBar from '../components/ContentBar/ContentBar'
import categories from '../data/data'
import { useState } from 'react'
import { TCategory } from '../utils/types.payload'
import crud from '../utils/crud'

export default function Home() {
    const [selectedCategory, setSelectedCategory] = useState<TCategory | null>(null);
    const [data, setData] = useState(categories);
    const { update } = crud;

    const filteredData = selectedCategory ? [selectedCategory] : categories;
    // Update a single category of the category list identified by its name
    function updateCategory(updatedCategory: TCategory) {
        setData((prevCategories) => update(prevCategories, updatedCategory));
    }


    return (
        <>
            <Header />
            <section>
                <SideBar
                    selectedCategory={selectedCategory}
                    updateCategory={updateCategory}
                    setSelectedCategory={setSelectedCategory}
                    categories={data}>
                </SideBar>
                <ContentBar
                    updateCategory={updateCategory}
                    categories={filteredData}>
                </ContentBar>
            </section>
        </>
    )
}
