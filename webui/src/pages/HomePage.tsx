import MyButton from "../components/ui/MyButton";
import Link from "../navigation/Link";

const HomePage = () => {
  const meta = Object.fromEntries(new URLSearchParams(location.search));

  function showSearchParams(): void {
    alert(JSON.stringify(meta, null, 2));
  }

  return (
    <div className="flex w-full flex-col items-center justify-center gap-5">
      <div className="text-xl font-semibold text-indigo-700">HomePage v4</div>

      <MyButton onClick={showSearchParams}>show search params</MyButton>

      <Link className="text-blue-500" to={`/preview?device=${meta.device || "3"}`}>
        Go to Preview
      </Link>
    </div>
  );
};

export default HomePage;
