import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

import Spinner from "../components/ui/Spinner";
import * as rtcSocket from "../sockets/webrtc.socket";
import Switch from "../components/ui/Switch";
import MyButton from "../components/ui/MyButton";
import ProfileWidget from "../components/ProfileWidget";

const PreviewPage = () => {
  const [isSearching, setIsSearching] = useState(false);
  const [socketConnected, setSocketConnected] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (socketConnected) {
      rtcSocket.heyIn(({ pid, pname }: any) => {
        navigate(`/call?pname=${pname}&pid=${pid}&first=false&video=${isVideoOn}`, {
          replace: true
        });
      });

      rtcSocket.replyIn(({ pid, pname }: any) => {
        navigate(`/call?pname=${pname}&pid=${pid}&first=true&video=${isVideoOn}`, {
          replace: true
        });
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
    <div className="flex h-screen w-full">
      <div className="flex h-screen w-full flex-col items-center justify-between gap-5 border-4 py-[18%]">
        <ProfileWidget username="Farid Mansimli" profession="Software Developer" />
        <Link className="text-blue-500" to="/">
          Go Home
        </Link>
        {isSearching ? (
          <Spinner className="h-20 w-20 border-8" />
        ) : (
          <div className="flex items-center justify-center rounded-md border-2 px-10 py-5">
            <Switch label="video" onChange={(value) => setIsVideoOn(value)} />
          </div>
        )}
        <div className="my-5">
          <MyButton onClick={searchOrCancel}>{isSearching ? "cancel" : "search"}</MyButton>
        </div>
      </div>
    </div>
  );
};

export default PreviewPage;
