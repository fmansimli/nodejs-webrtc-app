import Link from "../navigation/Link";

const NotFoundPage = () => {
  return (
    <div className="flex w-full flex-col items-center justify-center gap-5">
      <div className="text-xl">404! Not Found.</div>
      <Link className="text-blue-500" to="/">
        Go Home
      </Link>
    </div>
  );
};

export default NotFoundPage;
