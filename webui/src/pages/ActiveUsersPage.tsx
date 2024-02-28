import { useEffect, useState, useRef } from "react";
import Lottie from "lottie-react";
import useNavigation from "../hooks/use-navigation";

import Navbar from "../components/_common/Navbar";
import ProfileWidget from "../components/ProfileWidget";
import Spinner from "../components/ui/Spinner";
import MyDialog from "../components/MyDialog";

import * as rtcSocket from "../sockets/webrtc.socket";

import UserlessLottie from "../assets/lottie/no-active-users.json.json";
import CallRejectedLottie from "../assets/lottie/call-rejected.json";
import InCallLottie from "../assets/lottie/in-call.json";
import OutCallLottie from "../assets/lottie/out-call.json";

const ActiveUsersPage = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [callee, setCallee] = useState<any>(null);
  const [caller, setCaller] = useState<any>(null);
  const [rejecter, setRejecter] = useState<any>(null);

  const callRef = useRef<boolean>(false);

  const { navigate } = useNavigation();

  useEffect(() => {
    fetchUsers();

    return () => {
      if (!callRef.current) {
        rtcSocket.disconnect((succeed) => succeed);
      }
    };
  }, []);

  useEffect(() => {
    rtcSocket.userJoined((user) => {
      setUsers((old) => [...old, user]);
    });
  }, []);

  useEffect(() => {
    rtcSocket.userLeft((user) => {
      setUsers((old) => old.filter((u) => u.id !== user.id));
    });
  }, []);

  useEffect(() => {
    rtcSocket.callIn((user) => {
      callRef.current = true;
      setRejecter(null);
      setCaller(user);
    });
  }, []);

  useEffect(() => {
    rtcSocket.callCanceled((_user) => {
      setCaller(null);
      callRef.current = false;
    });
  }, []);

  useEffect(() => {
    rtcSocket.answerCallIn(({ id, username, answer }) => {
      if (answer) {
        rtcSocket.leaveRoom("active", () => {
          const sp = { pid: id, pname: username, isVideoOn: true, first: true };
          const params = new URLSearchParams(sp as any).toString();
          navigate("/call?" + params);
        });
      } else {
        setCallee(null);
        setRejecter({ username });
        callRef.current = false;
      }
    });
  }, []);

  function handleCall(answer: boolean) {
    const { id, username } = caller;
    rtcSocket.answerCall(id, answer);

    if (answer) {
      rtcSocket.leaveRoom("active", () => {
        const sp = { pid: id, pname: username, isVideoOn: true, first: false };
        const params = new URLSearchParams(sp as any).toString();
        navigate("/call?" + params);
      });
    } else {
      setCaller(null);
      callRef.current = false;
    }
  }

  const fetchUsers = () => {
    rtcSocket.initWebRTC(import.meta.env.VITE_EXAMPLE_TOKEN, (succeed) => {
      if (succeed) {
        rtcSocket.switchToActive(() => {
          rtcSocket.getActiveUsers((users) => {
            if (users) {
              setUsers(users);
              setLoading(false);
            } else {
              setLoading(false);
            }
          });
        });
      } else {
        setLoading(false);
      }
    });
  };

  async function onCallHandler(user: any) {
    const result = window.confirm(`do you want to call "${user.username}" ?`);

    if (result) {
      callRef.current = true;
      setCallee(user);
      rtcSocket.call(user.id);
    }
  }

  function onInfoHandler(user: any): void {
    const { username, lang } = user || {};
    alert(JSON.stringify({ username, lang }, null, 2));
  }

  function cancelCall(): void {
    try {
      rtcSocket.cancelCall(callee.id, () => {
        setCallee(null);
        callRef.current = false;
      });
    } catch (error) {
      console.log("CALL_CANCEL_ERROR:", error);
    }
  }

  const UsersList = users.map((user, key) => {
    if (user.id !== rtcSocket.socket.id) {
      return (
        <div key={user.id + key} className="col-span-1">
          <ProfileWidget user={user} onCall={onCallHandler} onInfo={onInfoHandler} />
        </div>
      );
    }
  });

  return (
    <div className="flex min-h-screen w-full flex-col">
      <div>
        <Navbar />
      </div>
      <div className="flex w-full flex-1 bg-white py-10 dark:bg-gray-800">
        <div className="container flex w-full flex-1 flex-col">
          {loading ? (
            <div className="flex w-full flex-1 items-center justify-center">
              <Spinner className="h-20 w-20 border-8 md:h-40 md:w-40 md:border-[15px]" />
            </div>
          ) : users.length > 1 ? (
            <div className="grid w-full grid-cols-1 gap-x-3 gap-y-5 sm:grid-cols-2 lg:grid-cols-4">
              {UsersList}
            </div>
          ) : (
            <div className="flex w-full flex-1 flex-col items-center justify-evenly">
              <Lottie animationData={UserlessLottie} className="h-1/2 w-1/2" />
              <div className="text-lg text-gray-900 dark:text-white lg:text-2xl">
                <span>Oh, No online users.</span>
              </div>
            </div>
          )}
        </div>
      </div>
      <MyDialog
        open={!!caller}
        title={`"${caller?.username}" is calling you, answer?`}
        onLeftButtonClick={handleCall.bind(null, false)}
        onRightButtonClick={handleCall.bind(null, true)}
        leftButtonText="reject"
        rightButtonText="answer"
        hasLeftButton
        hasRightButton>
        <div className="my-5 flex w-full items-center justify-center">
          <Lottie className="h-40 w-40" animationData={InCallLottie} />
        </div>
      </MyDialog>

      <MyDialog
        open={!!callee}
        title={`you're calling "${callee?.username}" ...`}
        onLeftButtonClick={cancelCall}
        onRightButtonClick={() => null}
        leftButtonText="cancel"
        rightButtonText="answer"
        hasLeftButton
        hasRightButton={false}>
        <div className="my-5 flex w-full items-center justify-center">
          <Lottie className="h-40 w-40" animationData={OutCallLottie} />
        </div>
      </MyDialog>

      <MyDialog
        open={!!rejecter}
        title={`"${rejecter?.username}" rejected the call.`}
        onLeftButtonClick={() => null}
        onRightButtonClick={() => setRejecter(null)}
        leftButtonText="ok, got it"
        rightButtonText="ok, got it"
        hasLeftButton={false}
        hasRightButton>
        <div className="my-5 flex w-full items-center justify-center">
          <Lottie className="h-40 w-40" animationData={CallRejectedLottie} />
        </div>
      </MyDialog>
    </div>
  );
};

export default ActiveUsersPage;
