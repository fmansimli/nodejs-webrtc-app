import { useState, useEffect } from "react";
import useNavigation from "../hooks/use-navigation";

import Spinner from "../components/ui/Spinner";
import Switch from "../components/ui/Switch";
import MyButton from "../components/ui/MyButton";
import * as rtcSocket from "../sockets/webrtc.socket";
import PeopleWorld from "../components/PeopleWorld";

const PreviewPage = () => {
  const [isSearching, setIsSearching] = useState(false);
  const [socketConnected, setSocketConnected] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);

  const { navigate } = useNavigation();

  const meta = Object.fromEntries(new URLSearchParams(location.search));

  useEffect(() => {
    if (!socketConnected) return;

    rtcSocket.heyIn(({ pid, pname, deviceType, deviceName }: any) => {
      const s = { pid, pname, deviceName, deviceType, isVideoOn, first: false, me: meta.me };
      const params = new URLSearchParams(s as any).toString();
      navigate("/call?" + params);
    });

    rtcSocket.replyIn(({ pid, pname, deviceType, deviceName }: any) => {
      const s = { pid, pname, me: meta.me, deviceName, deviceType, isVideoOn, first: true };
      const params = new URLSearchParams(s as any).toString();
      navigate("/call?" + params);
    });
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
    <div className="min-h-screen w-full bg-gray-800">
      <div className="flex min-h-screen w-full flex-col items-center justify-evenly">
        <div className="flex w-full flex-col items-center gap-3">
          <PeopleWorld className="w-[80%] xl:w-1/3" />
        </div>
        <div className="flex flex-col items-center gap-8">
          {isSearching ? (
            <div className="my-8">
              <Spinner className="h-20 w-20 border-8 md:h-40 md:w-40 md:border-[15px]" />
            </div>
          ) : (
            <div className="flex items-center justify-center rounded-md border-2 px-10 py-5">
              <Switch
                label="video"
                onChange={(value) => setIsVideoOn(value)}
                checked={isVideoOn}
              />
            </div>
          )}
          <div>
            <MyButton onClick={searchOrCancel}>{isSearching ? "cancel" : "search"}</MyButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreviewPage;
