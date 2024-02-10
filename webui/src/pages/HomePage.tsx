import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <div className="flex w-full flex-col items-center justify-center gap-5">
      <div className="text-xl font-semibold text-indigo-700">HomePage v2</div>
      <Link className="text-blue-500" to="/preview">
        Go to Preview
      </Link>
    </div>
  );
};

export default HomePage;
