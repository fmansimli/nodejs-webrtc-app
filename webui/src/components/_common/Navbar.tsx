import { Link } from "../../navigation";
import useNavigation from "../../hooks/use-navigation";

import ThemeSwitcher from "../ThemeSwitcher";

const itemClass =
  "border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-blue-700 hover:bg-gray-100  dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white";

const focusClass =
  "text-blue-700 ring-2 z-10 ring-blue-700 dark:text-white dark:ring-blue-500";

const Navbar = () => {
  const { currentPath } = useNavigation();

  return (
    <div className="sticky top-0 w-full bg-white shadow-sm dark:bg-gray-800">
      <div className="container relative flex items-center justify-center py-5">
        <Link
          to="/"
          aria-current="page"
          className={`rounded-s-lg ${itemClass} ${currentPath === "/" ? focusClass : ""}`}>
          Global
        </Link>

        <Link
          to="/active"
          className={`rounded-e-lg ${itemClass} ${currentPath === "/active" ? focusClass : ""}`}>
          Active
        </Link>

        <div className="absolute inset-y-0 right-2 flex items-center">
          <ThemeSwitcher />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
