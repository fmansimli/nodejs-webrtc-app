import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <div className="flex w-full flex-col items-center justify-center gap-5">
      <div>HomePage</div>
      <Link className="text-blue-500" to="/preview">
        Go to Preview
      </Link>
    </div>
  );
};

export default HomePage;
