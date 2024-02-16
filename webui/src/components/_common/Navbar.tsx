import Link from "../../navigation/Link";

const Navbar = () => {
  return (
    <nav className="bg-gray-200">
      <div className="container mx-auto flex items-center justify-between">
        <div>
          <Link className="" to="/">
            Navbar
          </Link>
        </div>
        <ul className="flex items-center gap-6">
          <li>
            <a href="/">refresh</a>
          </li>
          <li>
            <Link className="inline-block py-3" to="/">
              Home
            </Link>
          </li>
          <li>
            <Link className="inline-block py-3" to="/preview">
              Preview
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
