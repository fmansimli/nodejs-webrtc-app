import MyButton from "../components/ui/MyButton";
import Link from "../navigation/Link";

import * as rtcSocket from "../sockets/webrtc.socket";

const HomePage = () => {
  const meta = Object.fromEntries(new URLSearchParams(location.search));

  function showSearchParams(): void {
    alert(JSON.stringify(meta, null, 2));
  }

  function showSocketData(): void {
    try {
      rtcSocket.getInfo((resp) => {
        console.log(resp);
      });
    } catch (error) {
      console.log("GET_SOCKET_DATA_ERROR", error);
    }
  }

  return (
    <div className="flex w-full flex-col items-center justify-center gap-5 bg-gray-800">
      <div className="text-xl font-semibold text-indigo-700">HomePage v8</div>

      <MyButton onClick={showSearchParams}>show search params</MyButton>
      <MyButton onClick={showSocketData}>show socket data</MyButton>

      <Link className="text-blue-500" to={`/preview`}>
        Go to Preview
      </Link>
    </div>
  );
};

export default HomePage;
