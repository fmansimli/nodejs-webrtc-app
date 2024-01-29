import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";

import { peerCons } from "../constants/webrtc";
import * as rtcSocket from "../sockets/webrtc.socket";

const CallPage = () => {
  const [callStarted, setCallStarted] = useState(false);
  const localRef = useRef<HTMLVideoElement>(null);
  const remoteRef = useRef<HTMLVideoElement>(null);

  const pc = useRef<RTCPeerConnection>(new RTCPeerConnection(peerCons));

  const locationn = useLocation();
  const { pid, first, pname } = locationn.state || {};

  useEffect(() => {
    if (!callStarted) {
      startCall();
    }
  }, []);

  useEffect(() => {
    rtcSocket.rtcIn(({ desc, type }: any) => {
      if (type === "offer") {
        createAnswer({ desc }).then((answer: any) => {
          rtcSocket.sendRTC(pid, "answer", answer);
        });
      } else if (type === "answer") {
        handleAnswer({ desc });
      } else if (type === "can") {
        const iceCandidate = new RTCIceCandidate(desc);

        if (pc.current) {
          pc.current?.addIceCandidate(iceCandidate);
        }
      }
    });
  }, []);

  useEffect(() => {
    pc.current.onicecandidate = (event) => {
      if (event.candidate) {
        rtcSocket.sendRTC(pid, "can", event.candidate);
      }
    };
  }, []);

  useEffect(() => {
    pc.current.ontrack = (event) => {
      if (remoteRef.current) {
        const remoteVideo = remoteRef.current;
        event.streams[0].getTracks().forEach((track) => {
          (remoteVideo.srcObject as MediaStream).addTrack(track);
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
      }

      const remoteStream = new MediaStream();
      if (remoteRef.current) {
        remoteRef.current.srcObject = remoteStream;
      }

      localStream?.getTracks().forEach((track) => {
        pc.current.addTrack(track, localStream);
      });

      if (first) {
        const offer = await createOffer();
        rtcSocket.sendRTC(pid, "offer", offer);
      }
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
        audio: false
      });

      return localStream;
    } catch (error: any) {
      console.error("LOCAL_MEDIA_ERROR: " + error);
    }
  }

  return (
    <div className="grid h-screen grid-cols-1 overflow-hidden">
      <video
        className="fixed left-5 top-5 z-10 h-20 w-32 rounded-md border-2 bg-black object-cover shadow-md lg:h-44 lg:w-80"
        id="user-1"
        ref={localRef}
        autoPlay
        playsInline></video>
      <video
        className="h-full w-full bg-black object-cover"
        ref={remoteRef}
        autoPlay
        playsInline></video>
      <div className="bg-indigo-200 rounded-md py-1 px-4 absolute right-2 bottom-2">
        <a className="text-black" href="/">
          {pname}
        </a>
      </div>
    </div>
  );
};

export default CallPage;
