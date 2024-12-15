import { useState } from "react"
import { ICategory } from "../../utils/types/schemas";
import { create } from "../../utils/crud";

type HeaderProps = {
    selectedCategory: ICategory | null;
    categories: ICategory[];
    setData: (categories: ICategory[]) => void;
};

export default function Header(props: HeaderProps) {
    const [url, setUrl] = useState('');
    const [title, setTitle] = useState('');

    const { selectedCategory, categories, setData } = props;


    function createBookmark() {
        if (!url || !title) {
            return;
        }

        if (!selectedCategory) {
            return;
        }

        const newBookmark = {
            title,
            description: '',
            url,
            updated: new Date().toISOString(),
        };

        selectedCategory.bookmarks.push(newBookmark);
        setData(create(categories, selectedCategory));

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
            <article className="form-container">
                <form>
                    <div className="form-control">
                        <label htmlFor="url">URL</label>
                        <input type="text"
                            id="url"
                            onChange={(e) => setUrl(e.target.value)}
                            placeholder="" />
                    </div>
                    <div className="form-control">
                        <label htmlFor="title">TITLE</label>
                        <input type="text"
                            id="title"
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="" />
                    </div>
                    <div className="form-control">
                        <label>CATEGORY (current)</label>
                        <div className="select wrapper"><span className="current-category">DEFAULT</span></div>
                    </div>
                    <div className="form-control">
                        <button type="button" onClick={createBookmark}>Create</button>
                    </div>
                </form>
            </article>
        </header>
    )
}
