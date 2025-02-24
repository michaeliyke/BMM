import { Dispatch, SetStateAction, useState } from "react";
import { TiExport } from "react-icons/ti";
import { v4 as uuid4 } from 'uuid';
import Bookmark from "../../data/adapters/bookmark";
import Category from "../../data/adapters/category";
import CategoryBookmark from "../../data/adapters/category_bookmark";
import CategoryTag from "../../data/adapters/category_tag";
import Tag from "../../data/adapters/tag";
import { getCurrentTabTitle, getCurrentTabUrl } from "../../utils/common";
import { IBookmark, ICategory, ITag } from "../../utils/types/schemas";
import ImportDialog from "./ImportDialog";

type HeaderProps = {
    selectedCategory: ICategory | null;
    categories: ICategory[];
    // setData takes in fn, a function that takes in the old state (ICategory[])
    // and returns the new state (ICategory[])
    // setData itself returns void
    setData: (fn: (categories: ICategory[]) => ICategory[]) => void;
    defaultCategory: ICategory;
    grouping: string;
    setGrouping?: Dispatch<SetStateAction<string>>;
    selectedTag?: ITag | null;
    filterBy: string;
};


/**
 * Header component for the Bookmark Manager application.
 *
 * @param {HeaderProps} props - The properties passed to the Header component.
 * @param {ICategory | null} props.selectedCategory - The currently selected category.
 * @param {Function} props.setData - Function to update the state data.
 * @param {ICategory} props.defaultCategory - The default category to use if no category is selected.
 * @param {string} props.grouping - The current grouping criteria.
 * @param {string | null} props.selectedTag - The currently selected tag.
 * @param {string} props.filterBy - The current filter criteria.
 *
 * @returns {JSX.Element} The rendered Header component.
 */
export default function Header(props: HeaderProps) {
    const {
        selectedCategory,
        setData,
        defaultCategory,
        grouping,
        selectedTag,
        filterBy,
    } = props;

    const hideForm =
        filterBy === 'filter:archived' ||
        filterBy === 'filter:deleted' ||
        filterBy === 'filter:tags';

    const [url, setUrl] = useState(location.href);
    const [title, setTitle] = useState(document.title);
    const isButtonDisabled = !url || !title;

    useState(() => {
        getCurrentTabUrl()
            .then((url) => setUrl(url))
            .catch(console.error);

        getCurrentTabTitle()
            .then((title) => setTitle(title))
            .catch(console.error);
    });


    function createBookmark() {
        const resolvedCategory = selectedCategory || defaultCategory;
        if (!url || !title) return;

        if (!resolvedCategory) return;

        /* If selectedTag is set, it must be a tag under the selected category */

        const newBookmark: IBookmark = {
            id: uuid4(),
            title,
            description: '',
            url,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            tags: [],
            archived: 0,
        };

        const bookmark = new Bookmark(newBookmark);
        const category = new Category(resolvedCategory);

        // selectedTag and selectedCategory are set under CategoryTag filtering
        if (selectedTag && resolvedCategory) {
            const tag = new Tag(selectedTag);
            newBookmark.tags = [selectedTag];

            CategoryTag.createBookmark(bookmark, category, tag)
                .then(() => {
                    setUrl('');
                    setTitle('');
                    setData((state: ICategory[]) => {
                        const newState = [...state]; // shallow copy of the state array

                        const index = newState.findIndex((x) => x.id === resolvedCategory.id);
                        if (index === -1) return state; // Safety check: if not found, return the current state

                        const updatedCategory = {
                            ...newState[index], // shallow copy of the category object
                            bookmarks: [...newState[index].bookmarks, newBookmark], // new bookmarks array
                        };

                        newState[index] = updatedCategory; // Replace the category with the updated one
                        return newState; // Return the new state
                    });
                })
                .catch((error) => {
                    console.error(error);
                });
            return;
        }

        // Here no tag is selected, so we create a bookmark under the selected category
        if (selectedTag) {
            console.error('Unexpected selectedTag');
            // console.log('_selectedCategory: ', _selectedCategory);
            // console.log('selectedCategory: ', selectedCategory);
            return;
        }

        CategoryBookmark.createBookmark(new Bookmark(newBookmark), new Category(resolvedCategory))
            .then(() => {

                setUrl(location.href);
                setTitle(document.title);
                setData((state: ICategory[]) => {
                    const newState = [...state]; // shallow copy of the state array

                    const index = newState.findIndex((x) => x.id === resolvedCategory.id);
                    if (index === -1) return state; // Safety check: if not found, return the current state

                    const updatedCategory = {
                        ...newState[index], // shallow copy of the category object
                        bookmarks: [...newState[index].bookmarks, newBookmark], // new bookmarks array
                    };

                    newState[index] = updatedCategory; // Replace the category with the updated one
                    return newState; // Return the new state
                });
            })
            .catch((error) => {
                console.error(error);
            });

    }

    return (
        <header>
            <article>
                <section className="banner">
                    <figure className="logo-container">
                        <img src="../img/logo.png"
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
            <article className="form-container mt-4">
                <form className={`form ${hideForm ? 'hidden' : ''}`}>
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

                    {/* Submit Button */}
                    <div className="form-control flex space-x-2">
                        {/*  <button
                            type="button"
                            className="py-2 pr-2 pl-1 rounded-lg tracking-wide border border-green-700 text-green-700 focus:ring-2 focus:ring-green-50 flex items-center"
                        >
                            <CiImport className="mr-1" />
                            Import
                        </button> */}
                        <ImportDialog />
                        <button
                            type="button"
                            className="py-2 pr-2 pl-1 rounded-lg tracking-wide border border-green-700 text-green-700 focus:ring-2 focus:ring-green-50 flex items-center"
                        >
                            <TiExport className="mr-1" />
                            Export
                        </button>
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
