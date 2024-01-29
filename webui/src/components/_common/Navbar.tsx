import { NavLink } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-gray-200">
      <div className="container mx-auto flex items-center justify-between">
        <div>
          <NavLink to="/">Navbar</NavLink>
        </div>
        <ul className="flex items-center gap-6">
          <li>
            <a href="/">refresh</a>
          </li>
          <li>
            <NavLink className="inline-block py-3" to="/">
              Home
            </NavLink>
          </li>
          <li>
            <NavLink className="inline-block py-3" to="/preview">
              Preview
            </NavLink>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
