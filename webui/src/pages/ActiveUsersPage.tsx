import { useEffect, useState, useRef } from "react";
import Lottie from "lottie-react";
import useNavigation from "../hooks/use-navigation";

import Navbar from "../components/_common/Navbar";
import ProfileWidget from "../components/ProfileWidget";
import Spinner from "../components/ui/Spinner";

import * as rtcSocket from "../sockets/webrtc.socket";
import UserlessLottie from "../assets/lottie/no-active-users.json.json";

const ActiveUsersPage = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [callee, setCallee] = useState<any>(null);

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
      handleCall(user);
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
        alert("call rejected...");
      }
    });
  }, []);

  function handleCall(user: any) {
    const answer = window.confirm(`"${user.username}" is callling you, answer?`);

    console.log("maraqlidir qaqas...::", answer);

    const { id, username } = user;
    rtcSocket.answerCall(id, answer);

    if (answer) {
      rtcSocket.leaveRoom("active", () => {
        const sp = { pid: id, pname: username, isVideoOn: true, first: false };
        const params = new URLSearchParams(sp as any).toString();
        navigate("/call?" + params);
      });
    }
  }

  const fetchUsers = () => {
    setLoading(true);
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
    const result = window.confirm(`do you want to call ${user.username}`);

    if (result) {
      callRef.current = true;
      setCallee(user);
      rtcSocket.call(user.id);
    }
  }

  const UsersList = users.map((user) => {
    if (user.id !== rtcSocket.socket.id) {
      return (
        <div key={user.id} className="col-span-1">
          <ProfileWidget user={user} onCall={onCallHandler} />
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
          {callee && (
            <div className="my-3 w-full border p-5 text-red-600">
              calling {callee.username} ({callee.id})
            </div>
          )}
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
    </div>
  );
};

export default ActiveUsersPage;
