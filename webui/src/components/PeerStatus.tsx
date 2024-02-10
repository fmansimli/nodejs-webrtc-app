import VideoIcon from "./icons/VideoIcon";
import Spinner from "./ui/Spinner";

interface IProps {
  type: string;
}

const Component: any = {
  PREP: <Spinner className="h-10 w-10 border-8" />,
  VIDEO_PAUSED: (
    <div className="rounded-full bg-white p-4">
      <VideoIcon on={false} />
    </div>
  ),
  CALL_ENDED: <div>Call ended.</div>
};

const PeerStatus: React.FC<IProps> = ({ type }) => {
  return Component[type];
};

export default PeerStatus;
