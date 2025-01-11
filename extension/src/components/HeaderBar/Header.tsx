import { useState } from "react"
import { IBookmark, ICategory } from "../../utils/types/schemas";
import { v4 as uuid4 } from 'uuid';
import CategoryBookmark from "../../data/adapters/category_bookmark";
import { HeaderProps } from "../../utils/types/props";
import Bookmark from "../../data/adapters/bookmark";
import Category from "../../data/adapters/category";
import CategoryTag from "../../data/adapters/category_tag";
import Tag from "../../data/adapters/tag";


export default function Header(props: HeaderProps) {
    const {
        selectedCategory,
        setData,
        defaultCategory,
        grouping,
        selectedTag,
        filterBy,
    } = props;

    const [url, setUrl] = useState(location.href);
    const [title, setTitle] = useState(document.title);
    const isButtonDisabled = !url || !title || filterBy === 'filter:tags';

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
                <form>
                    {/* URL Input */}
                    <div className="form-control relative">
                        <input
                            type="text"
                            id="url"
                            value={filterBy === 'filter:tags' ? '' : url}
                            onChange={(e) => setUrl(e.target.value)}
                            placeholder=" "
                            className="peer block w-full px-2.5 pb-2 pt-2 text-sm text-gray-400 bg-transparent border border-gray-200 rounded-lg focus:outline-none focus:ring-[0.1px] focus:ring-blue-500 focus:border-blue-200 focus:shadow-sm shadow-sm"
                        />
                        <label
                            htmlFor="url"
                            className="absolute text-sm text-gray-600 duration-200 transform -translate-y-4 scale-75 tracking-widest top-2 left-2.5 origin-[0] bg-white px-1 peer-placeholder-shown:translate-y-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:text-gray-400 peer-focus:-translate-y-4 peer-focus:scale-75"
                        >
                            URL
                        </label>


                    </div>

                    {/* Title Input */}
                    <div className="form-control relative">
                        <input
                            type="text"
                            id="title"
                            value={filterBy === 'filter:tags' ? '' : title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder=" "
                            className="peer block w-full px-2.5 pb-2 pt-2 text-sm text-gray-400 bg-transparent border border-gray-200 rounded-lg focus:outline-none focus:ring-[0.1px] focus:ring-blue-500 focus:border-blue-200 focus:shadow-sm shadow-sm"
                        />
                        <label
                            htmlFor="title"
                            className="absolute text-sm tracking-widest text-gray-600 duration-200 transform -translate-y-4 scale-75 top-2 left-2.5 origin-[0] bg-white px-1 peer-placeholder-shown:translate-y-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:text-gray-400 peer-focus:-translate-y-4 peer-focus:scale-75"
                        >
                            TITLE
                        </label>
                    </div>

                    {/* Grouping Input */}
                    <div className="form-control relative"><input
                        type="text"
                        id="grouping"
                        value={filterBy === 'filter:tags' ? '' : grouping}
                        placeholder=" "
                        disabled
                        className="peer block w-full px-2.5 pb-2 pt-2 text-sm text-gray-400 bg-transparent border border-gray-200 rounded-lg focus:outline-none focus:ring-[0.1px] focus:ring-blue-500 focus:border-blue-200 focus:shadow-sm shadow-sm"
                    />
                        <label
                            htmlFor="grouping"
                            className="absolute text-sm tracking-widest text-gray-600 duration-200 transform -translate-y-4 scale-75 top-2 left-2.5 origin-[0] bg-white px-1 peer-placeholder-shown:translate-y-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:text-gray-400 peer-focus:-translate-y-4 peer-focus:scale-75"
                        >
                            CURRENT CATEGORY
                        </label>
                    </div>

                    {/* Submit Button */}
                    <div className="form-control">
                        <button
                            disabled={isButtonDisabled}
                            type="button"
                            onClick={createBookmark}
                            className={`
                                 py-2 px-4 rounded-lg tracking-
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
