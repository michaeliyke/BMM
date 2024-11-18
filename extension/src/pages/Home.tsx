import Header from '../components/HeaderBar/Header'
import SideBar from '../components/SideBar/SideBar'
import ContentBar from '../components/ContentBar/ContentBar'
import categories from '../data/data'

export default function Home() {
    return (
        <>
            <Header />
            <section>
                <SideBar categories={categories} />
                <ContentBar categories={categories} />
            </section>
        </>
    )
}
