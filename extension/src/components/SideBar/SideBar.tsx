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
                  <li><span>1. Career Paths</span></li>
                  <li><span>2. Programming</span></li>
                  <li><span>3. Frontend World</span></li>
                  <li><span>4. Backend</span></li>
                  <li><span>5. Human World</span></li>
                  <li><span>6. Career Paths</span></li>
                  <li><span>7. Programming</span></li>
                  <li><span>8. Frontend World</span></li>
                  <li><span>9. Backend</span></li>
                  <li><span>10. Human World</span></li>
                  <li><span>11. Career Paths</span></li>
                  <li><span>12. Programming</span></li>
                  <li><span>13. Frontend World</span></li>
                  <li><span>14. Backend</span></li>
                  <li><span>15. Human World</span></li>
                  <li><span>16. Career Paths</span></li>
                  <li><span>17. Programming</span></li>
                  <li><span>18. Frontend World</span></li>
                  <li><span>19. Backend</span></li>
                  <li><span>20. Human World</span></li>
                  <li><span>21. Career Paths</span></li>
                  <li><span>22. Programming</span></li>
                  <li><span>23. Frontend World</span></li>
                  <li><span>24. Backend</span></li>
                  <li><span>25. Human World</span></li>
                  <li><span>26. Career Paths</span></li>
                  <li><span>27. Programming</span></li>
                  <li><span>28. Frontend World</span></li>
                  <li><span>29. Backend</span></li>
                  <li><span>30. Human World</span></li>
              </ul>
          </section>
          <footer>Sidebar Footer</footer>
      </article>
  )
}