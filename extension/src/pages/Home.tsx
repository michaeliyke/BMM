import { Dispatch, SetStateAction, useEffect } from 'react'
import ContentBar from '../components/ContentBar/ContentBar'
import Header from '../components/HeaderBar/Header'
import SideBar from '../components/SideBar/SideBar'
import { useAppState } from '../hooks/globalstate'
import { ICategory } from '../utils/types/schemas'


export type IHomeProps = {
  data: ICategory[];
  setData: Dispatch<SetStateAction<ICategory[]>>;
}

/**
 * The `Home` component is the main page of the application. It manages the state and interactions
 * for displaying and filtering categories, bookmarks, and tags. It also handles the default category
 * and updates to categories.
 */
export default function Home(props: IHomeProps) {
  const { data, setData } = props;
  const {
    headerForm,
    setDefaultCategory,
  } = useAppState();

  useEffect(() => {
    for (const category of data) {
      if (category.is_default === 1) {
        setDefaultCategory(category);
      }
    }
  }, [data, setDefaultCategory]);

  return (
    <>
      <Header setData={setData} categories={data} />

      <section className={headerForm ? `pt-[128px]` : ''}>
        <SideBar
          props={{
            categories: data,
            setData,
          }}
        />

        <ContentBar
          data={data}
          setData={setData}
        />
      </section>
    </>
  )
}
