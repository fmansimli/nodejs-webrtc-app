import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

import Spinner from "../components/ui/Spinner";
import * as rtcSocket from "../sockets/webrtc.socket";

const PreviewPage = () => {
  const [isSearching, setIsSearching] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    rtcSocket.initWebRTC(import.meta.env.VITE_EXAMPLE_TOKEN);
  }, []);

  useEffect(() => {
    rtcSocket.heyIn(({ pid, pname }: any) => {
      navigate("/call", { replace: true, state: { pid, pname, first: false } });
    });

    rtcSocket.replyIn(({ pid, pname }: any) => {
      navigate("/call", { replace: true, state: { pid, pname, first: true } });
    });
  }, []);

  async function searchOrCancel() {
    if (isSearching) {
      setIsSearching(false);
      return;
    }

    try {
      setIsSearching(true);
      rtcSocket.joinGlobal();
    } catch (error: any) {
      alert(error.message);
    }
  }

  return (
    <div className="flex w-full items-center justify-center">
      <div className="flex flex-col items-center gap-5">
        {isSearching && <Spinner />}
        <button onClick={searchOrCancel} className="rounded-md bg-amber-600 px-5 py-3">
          {isSearching ? "Cancel" : "search in global"}
        </button>
        <Link className="text-blue-500" to="/">
          Go Home
        </Link>
      </div>
    </div>
  );
};

export default PreviewPage;
