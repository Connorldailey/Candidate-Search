import { Link, useLocation } from "react-router-dom";

const Nav = () => {
  // TODO: Add necessary code to display the navigation bar and link between the pages
  const currentPage = useLocation().pathname;

  return (
    <nav>
      <ul className='nav'>
        <li className='nav-item'>
          <Link
            to="/"
            className={`nav-link ${currentPage === '/' ? 'active' : ''}`}
          >
            Home
          </Link>
        </li>
        <li className='nav-item'>
          <Link
            to="/SavedCandidates"
            className={`nav-link ${currentPage === '/SavedCandidates' ? 'active' : ''}`}
          >
            Potential Candidates
          </Link>
        </li>
      </ul>
    </nav>
  )
};

export default Nav;
