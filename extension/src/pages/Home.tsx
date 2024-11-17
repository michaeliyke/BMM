import Header from '../components/HeaderBar/Header'
import SideBar from '../components/SideBar/SideBar'
import ContentBar from '../components/ContentBar/ContentBar'

export default function Home() {
  return (
    <>
        <Header />
        <section>
            <SideBar />
            <ContentBar />
        </section>
    </>
  )
}