import MicIcon from "./icons/MicIcon";
import VideoIcon from "./icons/VideoIcon";
import HangUpIcon from "./icons/HangUpIcon";
import QuestionIcon from "./icons/QuestionIcon";
import SwapUserIcon from "./icons/SwapUserIcon";

interface IProps {
  onToogleMic: () => void;
  onToogleCamera: () => void;
  onShowQuestion: () => void;
  onHangUpCall: () => void;
  onSwapFrames: () => void;
  isMicOn: boolean;
  isVideoOn: boolean;
}

const CallActions: React.FC<IProps> = (props) => {
  return (
    <div className="flex items-center gap-5 rounded-3xl bg-white px-4 py-3 shadow-md md:gap-10 md:px-7 md:py-4">
      <div className="flex items-center gap-4">
        <button onClick={props.onToogleMic}>
          <MicIcon on={props.isMicOn} />
        </button>
        <div className="h-8 border-r border-gray-400" />
        <button onClick={props.onToogleCamera}>
          <VideoIcon on={props.isVideoOn} />
        </button>
      </div>
      <button onClick={props.onHangUpCall}>
        <div className="flex items-center justify-center rounded-full bg-red-600 p-3 md:p-5">
          <HangUpIcon />
        </div>
      </button>
      <div className="flex items-center gap-4">
        <button onClick={props.onShowQuestion}>
          <QuestionIcon />
        </button>
        <div className="h-8 border-r border-gray-400" />
        <button onClick={props.onSwapFrames}>
          <SwapUserIcon />
        </button>
      </div>
    </div>
  );
};

export default CallActions;
