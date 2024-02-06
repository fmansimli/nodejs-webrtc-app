import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

import Spinner from "../components/ui/Spinner";
import * as rtcSocket from "../sockets/webrtc.socket";

const PreviewPage = () => {
  const [isSearching, setIsSearching] = useState(false);
  const [socketConnected, setSocketConnected] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (socketConnected) {
      rtcSocket.heyIn(({ pid, pname }: any) => {
        navigate(`/call?pname=${pname}&pid=${pid}&first=false`, { replace: true });
      });

      rtcSocket.replyIn(({ pid, pname }: any) => {
        navigate(`/call?pname=${pname}&pid=${pid}&first=true`, { replace: true });
      });
    }
  }, [socketConnected]);

  async function searchOrCancel() {
    if (isSearching) {
      rtcSocket.disconnect();
      return;
    }

    try {
      setIsSearching(true);

      rtcSocket.initWebRTC(import.meta.env.VITE_EXAMPLE_TOKEN, (succeed) => {
        if (succeed) {
          rtcSocket.joinGlobal();
          setSocketConnected(true);
        } else {
          setIsSearching(false);
        }
      });
    } catch (error: any) {
      setIsSearching(false);
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
