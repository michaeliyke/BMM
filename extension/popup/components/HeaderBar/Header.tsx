import { useEffect, useState } from "react";
import { v4 as uuid4 } from 'uuid';
import Bookmark from "../../data/adapters/bookmark";
import Category from "../../data/adapters/category";
import Tag from "../../data/adapters/tag";
import { useAppState } from "../../hooks/globalstate";
import { getAllTabs, getCurrentTabTitle, getCurrentTabUrl, resetCategoryHighlights, resetTagHighlights } from "../../utils/common";
import { error } from "../../utils/functional.lib.dev";
import { IBMM, IBookmark, ITab } from "../../utils/types/schemas";
import AddAllWidget from "./AddAllWidget";
import ExportWidget from "./ImportExport/ExportWidget";
import ImportWidget from "./ImportExport/ImportWidget";

/**
 * Header component for the Bookmark Manager application.
 */
export default function Header() {
  const {
    headerForm,
    selectedCategory,
    selectedTag,
    grouping,
    setGrouping,
    feedAllStateComponents,
    setSelectedTag,
    setSelectedCategory,
    filterBy,
  } = useAppState();
  const [url, setUrl] = useState(location.href);
  const [title, setTitle] = useState(document.title);
  const isButtonDisabled = !url || !title;
  const [tabs, setTabs] = useState<ITab[]>([]);


  useEffect(function () {
    setGrouping(selectedCategory?.name + (selectedTag ? ` # ${selectedTag.name}` : ''));
    getCurrentTabUrl().then(setUrl).catch(error);
    getCurrentTabTitle().then(setTitle).catch(error);
    getAllTabs().then(setTabs).catch(error);
  }, [selectedCategory?.name, selectedTag, setUrl, setTitle, setGrouping]);

  function postProcessing(newBookmark: IBookmark) {
    feedAllStateComponents(function (bmm: IBMM) {
      bmm.bookmarkObjects = { ...bmm.bookmarkObjects, [newBookmark.id]: newBookmark };
      bmm.bookmarks = [...bmm.bookmarks, newBookmark.id];

      if (selectedCategory) { // Take care of categories updating
        const { bookmarkIds } = bmm.categoryObjects[selectedCategory.id];
        bookmarkIds.push(newBookmark.id);
        bmm.categoryObjects[selectedCategory.id].bookmarkIds = [...bookmarkIds];
      }

      if (selectedTag) { // Take care of tags updating
        const { bookmarkIds } = bmm.tagObjects[selectedTag.id];
        bookmarkIds.push(newBookmark.id);
        bmm.tagObjects[selectedTag.id].bookmarkIds = [...bookmarkIds];
      }

      return bmm;
    });
    return newBookmark;
  }

  function updateCategory(newBookmark: IBookmark) {
    if (selectedCategory) {
      selectedCategory.bookmarkIds.push(newBookmark.id);
      Category.update(selectedCategory);
    }
    return newBookmark;
  }

  function updateTag(newBookmark: IBookmark) {
    if (selectedTag) {
      selectedTag.bookmarkIds.push(newBookmark.id);
      Tag.update(selectedTag);
    }
    return newBookmark;
  }

  /**
   * Resets any applicable state variables like selected category, tag. etc
   */
  function resetState() {
    // setUrl('');
    // setTitle('');

    if (selectedTag)
      setSelectedTag(null);

    if (selectedCategory)
      setSelectedCategory(null);

    switch (filterBy) {
      case "filter:categories":
        resetCategoryHighlights();
        break;
      case "filter:tags":
        resetTagHighlights();
    }
  }


  function createBookmark() {
    if (!url || !title) return;
    const bookmark = new Bookmark({
      id: uuid4(),
      title,
      description: '',
      url,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      archived: 0,
      tagIds: selectedTag ? [selectedTag.id] : [],
      categoryIds: selectedCategory ? [selectedCategory.id] : [],
    });

    /**
    * case 0: neither category nor tag selected
    * case 1: ony category, no tag
    * case 2: only tag selected, no category
    * case 3: both category and tag are selected
    */
    bookmark.create()
      .then(postProcessing)
      .then(updateCategory)
      .then(updateTag)
      .then(resetState)
      .catch(error);
  }

  return (
    <header className="border border-gray-200 shadow-sm">
      <article>
        <section className="banner">
          <figure className="logo-container">
            <img src="../assets/img/logo.png"
              alt="Logo"
              className="logo" />
          </figure>
          <h1 className="logo-caption">BOOKMARK MANAGER</h1>
          <figure className="tagline-separator"> </figure>
          <h2 className="project-tagline">BOOKMARK MANAGER</h2>
        </section>
        <section className="profile">
          <figure className="user-menu">
            <div className="profile-icon"></div>
            <section className="dropdown">
              <ul>
                <li className="a">Profile</li>
                <li className="a">Settings</li>
                <li className="a">Logout</li>
              </ul>
            </section>
          </figure>
        </section>
      </article>
      <article className={`form-container ${headerForm ? 'mt-4' : ''}`}>
        <form className={`form ${headerForm ? '' : 'hidden'}`}>
          {/* URL Input */}
          <div className="form-control relative">
            <input
              type="text"
              id="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder=" "
              className="peer block w-full px-2.5 pb-2 pt-2 text-sm text-gray-400 bg-transparent border border-gray-200 rounded-lg focus:outline-none focus:ring-[0.1px] focus:ring-blue-500 focus:border-blue-200 focus:shadow-sm shadow-sm"
            />
            <label
              htmlFor="url"
              className={" absolute text-sm text-gray-600 duration-200 transform -translate-y-4 scale-75 tracking-widest top-2 left-2.5 origin-[0] bg-white px-1 peer-placeholder-shown:translate-y-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:text-gray-400 peer-focus:-translate-y-4 peer-focus:scale-75"}
            >
              URL
            </label>


          </div>

          {/* Title Input */}
          <div className="form-control relative">
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder=" "
              className="peer block w-full px-2.5 pb-2 pt-2 text-sm text-gray-400 bg-transparent border border-gray-200 rounded-lg focus:outline-none focus:ring-[0.1px] focus:ring-blue-500 focus:border-blue-200 focus:shadow-sm shadow-sm"
            />
            <label
              htmlFor="title"
              className={" absolute text-sm tracking-widest text-gray-600 duration-200 transform -translate-y-4 scale-75 top-2 left-2.5 origin-[0] bg-white px-1 peer-placeholder-shown:translate-y-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:text-gray-400 peer-focus:-translate-y-4 peer-focus:scale-75"}
            >
              TITLE
            </label>
          </div>

          {/* Grouping Input */}
          <div className="form-control relative"><input
            type="text"
            id="grouping"
            value={grouping}
            placeholder=" "
            disabled
            title="Select categories from the sidebar"
            className={' peer block w-full px-2.5 pb-2 pt-2 text-sm text-gray-400 bg-transparent border border-gray-200 rounded-lg focus:outline-none focus:ring-[0.1px] focus:ring-blue-500 focus:border-blue-200 focus:shadow-sm shadow-sm'}
          />
            <label
              htmlFor="grouping"
              className={" absolute text-sm tracking-widest text-gray-600 duration-200 transform -translate-y-4 scale-75 top-2 left-2.5 origin-[0] bg-white px-1 peer-placeholder-shown:translate-y-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:text-gray-400 peer-focus:-translate-y-4 peer-focus:scale-75"}
            >
              CURRENT CATEGORY
            </label>
          </div>
          <div className="form-control flex space-x-2">
            <AddAllWidget tabs={tabs} setTabs={setTabs} />
            {/* Submit Button */}
            <ImportWidget />
            <ExportWidget />

            <button
              disabled={isButtonDisabled}
              type="button"
              onClick={createBookmark}
              className={`
            py-2 px-4 rounded-full tracking-wide
            ${isButtonDisabled
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-500 text-white hover:bg-blue-600 focus:ring-2 focus:ring-blue-300'
                }
        `}
            >
              Create
            </button>
          </div>

        </form>
      </article>
    </header>
  )
}
