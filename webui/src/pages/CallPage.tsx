import { useEffect, useRef, useState } from "react";
import useNavigation from "../hooks/use-navigation";
import Lottie from "lottie-react";

import { peerCons } from "../constants/webrtc";
import * as rtcSocket from "../sockets/webrtc.socket";

import PeerStatus from "../components/PeerStatus";
import CallActions from "../components/CallActions";
import MyButton from "../components/ui/MyButton";
import VacationLottie from "../assets/lottie/vacation.json";

const CallPage = () => {
  const [callStarted, setCallStarted] = useState(false);
  const [callEnded, setCallEnded] = useState(false);

  const localRef = useRef<HTMLVideoElement>(null);
  const remoteRef = useRef<HTMLVideoElement>(null);

  const [isMicOn, setIsMicOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isPeerReady, setIsPeerReady] = useState(false);

  const [peerData, setPeerData] = useState({ type: "PREP" });
  const { navigate } = useNavigation();

  const pc = useRef<RTCPeerConnection>(new RTCPeerConnection(peerCons));
  const meta = Object.fromEntries(new URLSearchParams(location.search));

  useEffect(() => {
    return () => {
      rtcSocket.disconnect((succeed) => succeed);
    };
  }, []);

  useEffect(() => {
    if (meta.pid && meta.pname && rtcSocket?.socket?.connected) {
      startCall();
    }
  }, []);

  useEffect(() => {
    if (!isPeerReady || meta.first !== "true") return;

    createOffer().then((offer) => rtcSocket.sendRTC(meta.pid, "offer", offer));
  }, [isPeerReady]);

  useEffect(() => {
    if (rtcSocket?.socket?.connected) {
      rtcSocket.rtcIn(({ desc, type }: any) => {
        if (type === "offer") {
          createAnswer({ desc }).then((answer: any) => {
            rtcSocket.sendRTC(meta.pid, "answer", answer);
          });
        } else if (type === "answer") {
          handleAnswer({ desc });
        } else if (type === "can") {
          const iceCandidate = new RTCIceCandidate(desc);

          if (pc.current) {
            pc.current?.addIceCandidate(iceCandidate);
          }
        } else if (type === "act") {
          if (desc.type === "CALL_ENDED") {
            try {
              (localRef.current?.srcObject as MediaStream)
                .getTracks()
                .forEach((track) => track.stop());
              setCallEnded(true);
            } catch (error) {
              console.error("CALL_VIDEO_STOPPING_ERROR: " + error);
            }
          } else {
            setPeerData(desc);
          }
        } else if (type === "ready") {
          setIsPeerReady(true);
          setPeerData({ type: desc.type });
        }
      });
    }
  }, []);

  useEffect(() => {
    if (rtcSocket?.socket?.connected) {
      pc.current.onicecandidate = (event) => {
        if (event.candidate) {
          rtcSocket.sendRTC(meta.pid, "can", event.candidate);
        }
      };
    }
  }, []);

  useEffect(() => {
    if (rtcSocket?.socket?.connected) {
      pc.current.ontrack = (event) => {
        if (remoteRef.current) {
          const remoteVideo = remoteRef.current;
          event.streams[0].getTracks().forEach((track) => {
            (remoteVideo.srcObject as MediaStream)?.addTrack(track);
          });
        }
      };
    }
  }, []);

  async function startCall() {
    if (callStarted) return;

    try {
      const localStream = await getLocalMedia();
      setCallStarted(true);

      if (localRef.current && localStream) {
        localRef.current.srcObject = localStream;

        if (meta.isVideoOn !== "true") {
          toogleCamera();
        }
      }

      const remoteStream = new MediaStream();
      if (remoteRef.current) {
        remoteRef.current.srcObject = remoteStream;
      }

      localStream?.getTracks().forEach((track) => {
        pc.current.addTrack(track, localStream);
      });

      rtcSocket.sendRTC(meta.pid, "ready", {
        type: meta.isVideoOn === "true" ? "" : "VIDEO_PAUSED"
      });
    } catch (error: any) {
      console.error("START_CALL_ERROR: " + error);
    }
  }

  async function createOffer() {
    try {
      const offer = await pc.current.createOffer();
      await pc.current.setLocalDescription(offer);

      return offer;
    } catch (error: any) {
      console.error("OFFER_CREATE_ERROR: " + error);
    }
  }

  async function createAnswer({ desc }: { desc: any }) {
    try {
      const offerDesc = new RTCSessionDescription(desc);
      await pc.current?.setRemoteDescription(offerDesc);

      const answer = await pc.current.createAnswer();
      await pc.current.setLocalDescription(answer);

      return Promise.resolve(answer);
    } catch (error: any) {
      console.error("ANSWER_CREATE_ERROR: " + error);
    }
  }

  async function handleAnswer({ desc }: { desc: any }) {
    try {
      const answerDesc = new RTCSessionDescription(desc);
      if (!pc.current.currentRemoteDescription) {
        await pc.current?.setRemoteDescription(answerDesc);
      }
      return;
    } catch (error: any) {
      console.error("ANSWER_HANDLE_ERROR: " + error);
    }
  }

  async function getLocalMedia() {
    try {
      const localStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { min: 640, ideal: 1920, max: 1920 },
          height: { min: 480, ideal: 1080, max: 1080 }
        },
        audio: true
      });

      return localStream;
    } catch (error: any) {
      console.error("LOCAL_MEDIA_ERROR: " + error);
    }
  }

  async function toogleCamera() {
    try {
      const videoTrack = (localRef.current?.srcObject as MediaStream)
        .getTracks()
        .find((track) => track.kind === "video");

      if (videoTrack?.enabled) {
        videoTrack.enabled = false;
        setIsVideoOn(false);
        rtcSocket.sendRTC(meta.pid, "act", { type: "VIDEO_PAUSED" });
      } else {
        videoTrack!.enabled = true;
        setIsVideoOn(true);
        rtcSocket.sendRTC(meta.pid, "act", { type: "" });
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function toogleMic() {
    try {
      const audioTrack = (localRef.current?.srcObject as MediaStream)
        .getTracks()
        .find((track) => track.kind === "audio");

      if (audioTrack?.enabled) {
        audioTrack.enabled = false;
        setIsMicOn(false);
      } else {
        audioTrack!.enabled = true;
        setIsMicOn(true);
      }
    } catch (error) {
      console.error(error);
    }
  }

  function hangUpCall(): void {
    try {
      (localRef.current?.srcObject as MediaStream)
        .getTracks()
        .forEach((track) => track.stop());

      rtcSocket.sendRTC(meta.pid, "act", { type: "CALL_ENDED" });
    } catch (error) {
      console.error("CALL_HANGUP_ERROR:::", error);
    } finally {
      setCallEnded(true);
    }
  }

  function swapFrames(): void {
    alert("test!");
  }

  function showQuestion(): void {
    alert("test!");
  }

  function getSocketData(): void {
    //
  }

  function goToHome(): void {
    navigate("/");
  }

  if (!meta.pid || !meta.pname || callEnded || !rtcSocket?.socket) {
    return (
      <div className="h-screen w-full bg-white dark:bg-gray-800">
        <div className="flex h-screen w-full flex-col items-center justify-around">
          <div className="w-[70%] lg:w-[45%] xl:w-[35%] ">
            <Lottie animationData={VacationLottie} />
          </div>
          <div className="flex flex-col items-center gap-10">
            <div className="text-2xl font-semibold text-white">
              <div className="text-blue-700 dark:text-white" onClick={getSocketData}>
                Call Ended!
              </div>
            </div>
            <MyButton onClick={goToHome}>Go To Home</MyButton>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative grid h-screen w-full grid-cols-1 overflow-hidden">
      <div className="fixed left-5 top-5 z-10 h-1/4 w-1/4">
        <div className="absolute inset-0 flex items-center justify-center">
          {!isVideoOn && <PeerStatus type="VIDEO_PAUSED" />}
        </div>

        <video
          className="h-full w-full rounded-md border-2 bg-black object-contain shadow-md"
          id="user-1"
          ref={localRef}
          autoPlay
          playsInline></video>
      </div>
      <div className="relative h-screen w-full">
        <div className="absolute inset-0 flex items-center justify-center">
          <PeerStatus type={peerData.type} />
        </div>
        <video
          className="h-full w-full bg-black object-contain"
          ref={remoteRef}
          playsInline
          autoPlay></video>
      </div>

      <div className="fixed inset-x-0 bottom-7 flex justify-center">
        <CallActions
          onHangUpCall={hangUpCall}
          onToogleCamera={toogleCamera}
          onToogleMic={toogleMic}
          onShowQuestion={showQuestion}
          onSwapFrames={swapFrames}
          isMicOn={isMicOn}
          isVideoOn={isVideoOn}
        />
      </div>

      <button
        className="absolute right-2 top-2 rounded-md bg-indigo-200 px-4 py-1 text-violet-800"
        onClick={getSocketData}>
        {meta.pname}
      </button>
    </div>
  );
};

export default CallPage;
