import { TCategory } from "../../utils/types.payload";

type SideBarProps = {
    categories: TCategory[];
    updateCategory?: (category: TCategory) => void;
};


export default function ContentBar(props: SideBarProps) {
    const { categories } = props;

    return (
        <article className="content">
            <header>Content Header</header>
            <section>
                {categories.map((category) => (
                    category.bookmarks.map((bookmark, index) => (
                        <div className="block" key={index}>{bookmark.title}</div>
                    ))
                ))}
            </section>
            <footer>Content Footer</footer>
        </article>
    )
}
