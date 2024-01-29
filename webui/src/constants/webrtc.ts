export const peerCons = {
  iceServers: [
    {
      urls: "stun:stun.l.google.com:19302"
    }
  ]
};

export const sessionCons = {
  mandatory: {
    OfferToReceiveAudio: true,
    OfferToReceiveVideo: true,
    VoiceActivityDetection: true
  }
};

export const mediaCons = {
  audio: true,
  video: {
    frameRate: 30,
    facingMode: "user" //environment
  }
};
