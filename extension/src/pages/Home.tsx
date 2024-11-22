import Header from '../components/HeaderBar/Header'
import SideBar from '../components/SideBar/SideBar'
import ContentBar from '../components/ContentBar/ContentBar'
import categories from '../data/data'
import { useState, Dispatch, SetStateAction, useContext } from 'react'
import { TCategory } from '../utils/types.payload'
import { update } from '../utils/crud'
import { DataContext } from '../utils/contexts'

type HomeProps = {
    data: TCategory[];
    setData: Dispatch<SetStateAction<TCategory[]>>;
};

export default function Home({ data, setData }: HomeProps) {
    const [selectedCategory, setSelectedCategory] = useState<TCategory | null>(null);
    const { defaultCategory } = useContext(DataContext)
    let filteredData = categories;

    if (selectedCategory)
        filteredData = [selectedCategory];

    // Update a single category of the category list identified by its name
    function updateCategory(updatedCategory: TCategory) {
        setData((prevCategories) => update(prevCategories, updatedCategory));
    }

    return (
        <>
            <Header
                selectedCategory={selectedCategory}
                setData={setData}
                categories={data}>
            </Header>
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
