import Header from '../components/HeaderBar/Header'
import SideBar from '../components/SideBar/SideBar'
import ContentBar from '../components/ContentBar/ContentBar'
import categories from '../data/data'
import { useState } from 'react'
import { TCategory } from '../utils/types.payload'
import crud from '../utils/crud'

export default function Home() {
    const [data, setData] = useState(categories)
    const { update } = crud;

    // Update a single category of the category list identified by its name
    function updateCategory(updatedCategory: TCategory) {
        setData((prevCategories) => update(prevCategories, updatedCategory));
    }

    return (
        <>
            <Header />
            <section>
                <SideBar updateCategory={updateCategory} categories={data} />
                <ContentBar updateCategory={updateCategory} categories={data} />
            </section>
        </>
    )
}
