import Lottie from "lottie-react";

import Search2 from "../assets/lottie/search2.json";
import Search3 from "../assets/lottie/search3.json";

const Animation: any = {
  1: Search2,
  2: Search2,
  3: Search3,
  4: Search2,
  5: Search2
};

const SearchLottie = () => {
  const random = Math.floor(Math.random() * 5) + 1;

  return (
    <Lottie
      animationData={Animation[random]}
      className="h-full w-full"
      title="Searching..."
      alt="Searching..."
      loop
    />
  );
};

export default SearchLottie;
