import { categories } from "../../data/data"

export default function SideBar() {
  return (
      <article className="sidebar">
          <header>
              <section>
                  <select aria-label="Filter Options">
                      <option value="categories"
                          className="current">Categories</option>
                      <option value="filter-tags">Filter:Tags</option>
                      <option value="filter-category-tags">Filter:Category/Tags</option>
                  </select>
              </section>
          </header>
          <section className="filtered-list">
              <ul>
                {categories.map((category, index) => (
                    <li key={index}>
                        <span>{category.name}</span>
                    </li>
                ))}
              </ul>
          </section>
          <footer>Sidebar Footer</footer>
      </article>
  )
}