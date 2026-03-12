import { useLocation } from "react-router-dom";
import {VideoPlayer} from "../components/VideoPlayer";

const Watch = () => {
  const location = useLocation();
  const video = location.state;

  if (!video) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400">
        Video not found.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black p-8">
      <VideoPlayer video={video} />
    </div>
  );
};

export default Watch;
