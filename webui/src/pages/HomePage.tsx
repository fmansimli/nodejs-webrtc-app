import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <div className="flex w-full flex-col items-center justify-center gap-5">
      <div className="text-xl text-indigo-700 font-semibold">HomePage v1</div>
      <Link className="text-blue-500" to="/preview">
        Go to Preview
      </Link>
    </div>
  );
};

export default HomePage;
