import Header from '../components/HeaderBar/Header'
import SideBar from '../components/SideBar/SideBar'
import ContentBar from '../components/ContentBar/ContentBar'
import categories from '../data/data'
import { useState, Dispatch, SetStateAction } from 'react'
import { ICategory } from '../utils/types/schemas'
import { update } from '../utils/crud'

type HomeProps = {
    data: ICategory[];
    setData: Dispatch<SetStateAction<ICategory[]>>;
};

export default function Home({ data, setData }: HomeProps) {
    const [selectedCategory, setSelectedCategory] = useState<ICategory | null>(null);
    let filteredData = categories;

    if (selectedCategory)
        filteredData = [selectedCategory];

    // Update a single category of the category list identified by its name
    function updateCategory(updatedCategory: ICategory) {
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
