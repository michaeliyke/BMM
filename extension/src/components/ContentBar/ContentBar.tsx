import { TCategory } from "../../utils/types.payload";
import moment from 'moment';
import { FaArchive, FaEdit, FaTrashAlt, FaStar } from 'react-icons/fa';

type SideBarProps = {
    categories: TCategory[];
    updateCategory?: (category: TCategory) => void;
};

type ListBookmarksProps = {
    categories: TCategory[];
};

const ListBookmarks = ({ categories }: ListBookmarksProps) => {
    return (
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
            {categories.map((category) =>
                category.bookmarks.map((bookmark, index) => (
                    <div
                        key={index}
                        className="relative p-4 bg-white shadow-md rounded-md hover:shadow-lg hover:bg-gray-50 transition duration-300 group"
                    >
                        {/* Action Icons */}
                        <div className="absolute top-2 right-2 flex space-x-2 opacity-0 group-hover:opacity-100 transition duration-300">
                            <button className="text-gray-500 hover:text-blue-500">
                                <FaArchive size={18} />
                            </button>
                            <button className="text-gray-500 hover:text-green-500">
                                <FaEdit size={18} />
                            </button>
                            <button className="text-gray-500 hover:text-red-500">
                                <FaTrashAlt size={18} />
                            </button>
                        </div>

                        {/* Bookmark Details */}
                        <div>
                            <h3 className="text-lg font-semibold text-gray-800 truncate">
                                {bookmark.title}
                            </h3>
                            <p className="text-sm text-gray-500 truncate">{bookmark.url}</p>
                            <p className="text-sm text-gray-600 truncate">
                                {bookmark.description}
                            </p>
                        </div>

                        {/* Timestamp and Favorite Icon */}
                        <div className="flex justify-between items-center mt-4">
                            <span className="text-xs text-gray-400">
                                {moment(bookmark.updated).fromNow()}
                            </span>
                            <button className="text-yellow-500 hover:text-yellow-600">
                                <FaStar size={20} />
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
            <section>
                {categories.map((category) => (
                    category.bookmarks.map((bookmark, index) => (
                        <div className="block font-poppins text-blue-500 text-4xl bg-gray-100" key={index}>{bookmark.title}</div>
                    ))
                ))}
            </section>
            <footer>Content Footer</footer>
        </article>
    )
}
