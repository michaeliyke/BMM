import { TCategory } from "../../utils/types.payload";
import moment from 'moment';
import { MdOutlineArchive, MdOutlineEdit, MdOutlineDelete, MdOutlineStar } from 'react-icons/md';

type SideBarProps = {
    categories: TCategory[];
    updateCategory?: (category: TCategory) => void;
};

type ListBookmarksProps = {
    categories: TCategory[];
};

const ListBookmarks = ({ categories }: ListBookmarksProps) => {
    return (
        <section className="grid grid-cols-1 gap-6 p-6 bg-gray-50">
            {categories.map((category) =>
                category.bookmarks.map((bookmark, index) => (
                    <div
                        key={index}
                        className="relative p-5 bg-white shadow-md rounded-lg hover:shadow-xl hover:bg-gray-100 transition duration-300 group"
                    >
                        {/* Top Section: Title, Timestamp, and Action Icons */}
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-semibold text-gray-900 truncate">
                                {bookmark.title}
                            </h3>
                            <div className="flex items-center space-x-5">
                                {/* Action Icons */}
                                <div className="flex space-x-3 opacity-0 group-hover:opacity-100 transition duration-300">
                                    <button
                                        className="text-gray-500 hover:text-blue-600 transition duration-200"
                                        title="Archive"
                                    >
                                        <MdOutlineArchive size={20} />
                                    </button>
                                    <button
                                        className="text-gray-500 hover:text-green-600 transition duration-200"
                                        title="Edit"
                                    >
                                        <MdOutlineEdit size={20} />
                                    </button>
                                    <button
                                        className="text-gray-500 hover:text-red-600 transition duration-200"
                                        title="Delete"
                                    >
                                        <MdOutlineDelete size={20} />
                                    </button>
                                </div>
                                {/* Timestamp */}
                                <span className="text-sm text-gray-400">
                                    {moment(bookmark.updated).fromNow()}
                                </span>
                            </div>
                        </div>

                        {/* Bookmark Details */}
                        <div className="mt-4">
                            <p className="text-sm text-gray-600 truncate">{bookmark.url}</p>
                            <p className="text-sm text-gray-700 truncate">
                                {bookmark.description}
                            </p>
                        </div>

                        {/* Star Icon */}
                        <div className="absolute right-4 top-1/2 transform -translate-y-1/3">
                            <button
                                className="text-yellow-500 hover:text-yellow-600 transition duration-200"
                                title="Favorite"
                            >
                                <MdOutlineStar size={24} />
                            </button>
                        </div>
                    </div>
                ))
            )}
        </section>

    );
};

export default function ContentBar(props: SideBarProps) {
    const { categories } = props;

    return (
        <article className="content">
            <header>Content Header</header>
            <ListBookmarks categories={categories} />
            <footer>Content Footer</footer>
        </article>
    )
}
