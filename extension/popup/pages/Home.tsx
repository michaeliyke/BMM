import ContentBar from '../components/ContentBar/ContentBar';
import Header from '../components/HeaderBar/Header';
import SideBar from '../components/SideBar/SideBar';
import { useAppState } from '../hooks/globalstate';


/**
 * The `Home` component is the main page of the application. It manages the state and interactions
 * for displaying and filtering categories, bookmarks, and tags. It also handles the default category
 * and updates to categories.
 */
export default function Home() {
  const { headerForm, } = useAppState();

  return (
    <>
      <Header />

      <section className={headerForm ? `pt-[128px]` : 'pt-[35px]'}>
        <SideBar />

        <ContentBar />
      </section>
    </>
  )
}
