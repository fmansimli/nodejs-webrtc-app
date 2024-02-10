import { useEffect, useRef, useState } from "react";

import { peerCons } from "../constants/webrtc";
import * as rtcSocket from "../sockets/webrtc.socket";

import MicIcon from "../components/icons/MicIcon";
import VideoIcon from "../components/icons/VideoIcon";
import HangUpIcon from "../components/icons/HangUpIcon";

import PeerStatus from "../components/PeerStatus";
import Spinner from "../components/ui/Spinner";

const CallPage = () => {
  const [callStarted, setCallStarted] = useState(false);
  const [callEnded, setCallEnded] = useState(false);

  const localRef = useRef<HTMLVideoElement>(null);
  const remoteRef = useRef<HTMLVideoElement>(null);

  const [isMicOn, setIsMicOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isPeerReady, setIsPeerReady] = useState(false);

  const [peerData, setPeerData] = useState({ type: "PREP" });

  const pc = useRef<RTCPeerConnection>(new RTCPeerConnection(peerCons));
  const meta = Object.fromEntries(new URLSearchParams(location.search));

  useEffect(() => {
    if (meta.pid && meta.pname) {
      startCall();
    }
  }, []);

  useEffect(() => {
    if (!isPeerReady || meta.first !== "true") return;

    createOffer().then((offer) => rtcSocket.sendRTC(meta.pid, "offer", offer));
  }, [isPeerReady]);

  useEffect(() => {
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
          (localRef.current?.srcObject as MediaStream)
            .getTracks()
            .forEach((track) => track.stop());
          setCallEnded(true);
        } else {
          setPeerData(desc);
        }
      } else if (type === "ready") {
        setIsPeerReady(true);
        setPeerData({ type: "" });
      }
    });
  }, []);

  useEffect(() => {
    pc.current.onicecandidate = (event) => {
      if (event.candidate) {
        rtcSocket.sendRTC(meta.pid, "can", event.candidate);
      }
    };
  }, []);

  useEffect(() => {
    pc.current.ontrack = (event) => {
      if (remoteRef.current) {
        const remoteVideo = remoteRef.current;
        event.streams[0].getTracks().forEach((track) => {
          (remoteVideo.srcObject as MediaStream)?.addTrack(track);
        });
      }
    };
  }, []);

  async function startCall() {
    if (callStarted) return;

    try {
      const localStream = await getLocalMedia();
      setCallStarted(true);

      if (localRef.current && localStream) {
        localRef.current.srcObject = localStream;

        if (meta.video !== "true") {
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

      rtcSocket.sendRTC(meta.pid, "ready", {});
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

      setCallEnded(true);
      rtcSocket.sendRTC(meta.pid, "act", { type: "CALL_ENDED" });
    } catch (error) {
      console.error("CALL_HANGUP_ERROR:", error);
    }
  }

  if (!meta.pid || !meta.pname || callEnded) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center gap-10">
        <div className="text-xl font-semibold text-red-700">
          <div>Call Ended!</div>
        </div>
        <a className="text-blue-500" href="/">
          Go Home
        </a>
      </div>
    );
  }

  return (
    <div className="grid h-screen w-full grid-cols-1 overflow-hidden">
      <div className="fixed left-5 top-5 z-10">
        <div className="absolute left-[21%] right-[21%] top-[35%] flex justify-center">
          {!isVideoOn && <PeerStatus type="VIDEO_PAUSED" />}
        </div>

        <video
          className="h-20 w-32 rounded-md border-2 bg-black object-cover shadow-md lg:h-44 lg:w-80"
          id="user-1"
          ref={localRef}
          autoPlay
          playsInline></video>
      </div>
      <div className="relative h-screen w-full">
        <div className="absolute left-[21%] right-[21%] top-[42%] flex justify-center">
          <PeerStatus type={peerData.type} />
        </div>
        <video
          className="h-full w-full bg-black object-cover"
          ref={remoteRef}
          autoPlay
          playsInline></video>
      </div>

      <div className="fixed inset-x-0 bottom-7  mx-[20%] flex items-center justify-around rounded-xl bg-white py-3 shadow-md lg:mx-[30%]">
        <button onClick={toogleMic}>
          <div className="flex items-center justify-center rounded-full bg-slate-400 p-4">
            <MicIcon on={isMicOn} />
          </div>
        </button>
        <button onClick={toogleCamera}>
          <div className="flex items-center justify-center rounded-full bg-slate-400 p-4">
            <VideoIcon on={isVideoOn} />
          </div>
        </button>
        <button onClick={hangUpCall}>
          <div className="flex items-center justify-center rounded-full bg-red-700 p-4">
            <HangUpIcon />
          </div>
        </button>
      </div>

      <div className="absolute right-2 top-2 rounded-md bg-indigo-200 px-4 py-1">
        {meta.pname}
      </div>
    </div>
  );
};

export default CallPage;
