import { useState, useEffect } from "react";
import useNavigation from "../hooks/use-navigation";

import Switch from "../components/ui/Switch";
import MyButton from "../components/ui/MyButton";
import PeopleWorld from "../components/PeopleWorld";
import LangSelect from "../components/LangSelect";
import SearchLottie from "../components/SearchLottie";

import * as rtcSocket from "../sockets/webrtc.socket";
import Navbar from "../components/_common/Navbar";

const HomePage = () => {
  const [isSearching, setIsSearching] = useState(false);
  const [socketConnected, setSocketConnected] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);

  const { navigate } = useNavigation();

  useEffect(() => {
    if (!socketConnected) return;

    rtcSocket.heyIn(({ pid, pname, deviceType, deviceName }: any) => {
      const sp = { pid, pname, deviceName, deviceType, isVideoOn, first: false };
      const params = new URLSearchParams(sp as any).toString();
      navigate("/call?" + params);
    });

    rtcSocket.replyIn(({ pid, pname, deviceType, deviceName }: any) => {
      const sp = { pid, pname, deviceName, deviceType, isVideoOn, first: true };
      const params = new URLSearchParams(sp as any).toString();
      navigate("/call?" + params);
    });
  }, [socketConnected]);

  async function searchOrCancel() {
    if (isSearching) {
      rtcSocket.disconnect((_succeed) => null);
      return;
    }

    try {
      setIsSearching(true);

      rtcSocket.initWebRTC(import.meta.env.VITE_EXAMPLE_TOKEN, (succeed) => {
        if (succeed) {
          rtcSocket.joinGlobal((error: any) => {
            if (error) {
              alert(error.message);
            }
          });

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
    <div className="flex min-h-screen w-full flex-col">
      <div>
        <Navbar />
      </div>
      <div className="flex w-full flex-1 bg-white dark:bg-gray-800">
        <div className="flex w-full flex-1 flex-col items-center justify-center gap-9">
          <div className="flex w-full flex-col items-center">
            <PeopleWorld className="w-[80%] md:w-[60%] lg:w-[50%] xl:w-[40%]" />
          </div>
          <div className="flex flex-col items-center gap-8">
            {isSearching ? (
              <div className="flex h-52 items-center justify-center md:h-48 xl:h-40">
                <SearchLottie />
              </div>
            ) : (
              <>
                <LangSelect />
                <div className="flex items-center justify-center rounded-md border-2 px-10 py-5">
                  <Switch
                    label="video"
                    onChange={(value) => setIsVideoOn(value)}
                    checked={isVideoOn}
                  />
                </div>
              </>
            )}
            <div>
              <MyButton onClick={searchOrCancel}>{isSearching ? "cancel" : "search"}</MyButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
