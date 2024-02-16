import { useState, useEffect } from "react";
import useNavigation from "../hooks/use-navigation";
import Link from "../navigation/Link";

import Spinner from "../components/ui/Spinner";
import * as rtcSocket from "../sockets/webrtc.socket";
import Switch from "../components/ui/Switch";
import MyButton from "../components/ui/MyButton";
import ProfileWidget from "../components/ProfileWidget";

const PreviewPage = () => {
  const [isSearching, setIsSearching] = useState(false);
  const [socketConnected, setSocketConnected] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(false);

  const { navigate } = useNavigation();

  useEffect(() => {
    if (socketConnected) {
      rtcSocket.heyIn(({ pid, pname, deviceType, deviceName }: any) => {
        const data = { pid, pname, deviceName, deviceType, isVideoOn, first: false };
        const params = new URLSearchParams(data as any).toString();
        navigate("/call?" + params);
      });

      rtcSocket.replyIn(({ pid, pname, deviceType, deviceName }: any) => {
        const data = { pid, pname, deviceName, deviceType, isVideoOn, first: true };
        const params = new URLSearchParams(data as any).toString();
        navigate("/call?" + params);
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
