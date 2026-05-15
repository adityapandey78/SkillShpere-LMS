import { useCallback, useEffect, useRef, useState } from "react";
import ReactPlayer from "react-player";
import { Slider } from "../ui/slider";
import { Button } from "../ui/button";
import {
  Maximize,
  Minimize,
  Pause,
  Play,
  RotateCcw,
  RotateCw,
  Volume2,
  VolumeX,
  Zap,
} from "lucide-react";

function VideoPlayer({
  width = "100%",
  height = "100%",
  url,
  onProgressUpdate,
  progressData,
  onDuration,
}) {
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [muted, setMuted] = useState(false);
  const [played, setPlayed] = useState(0);
  const [seeking, setSeeking] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [isProgressHovered, setIsProgressHovered] = useState(false);

  const playerRef = useRef(null);
  const playerContainerRef = useRef(null);
  const controlsTimeoutRef = useRef(null);

  // Guards against firing the completion callback more than once per URL
  const completionFiredRef = useRef(false);

  // YouTube-specific internal playback state — stores the last known played
  // fraction so fireCompletion can report an accurate value even when called
  // from onEnded (where played may have already reset to 0)
  const ytStateRef = useRef({ lastPlayed: 0 });

  const isYoutube =
    typeof url === "string" &&
    (url.includes("youtube.com") || url.includes("youtu.be"));

  // ── Reset everything when the URL changes (lecture switch) ─────────────────
  // NOTE: with key={lecture._id} on the parent's <VideoPlayer> this also runs
  // on initial mount for each lecture, giving a guaranteed clean slate.
  useEffect(() => {
    setPlayed(0);
    setPlaying(false);
    completionFiredRef.current = false;
    ytStateRef.current = { lastPlayed: 0 };
  }, [url]);

  // ── Centralised completion firing ──────────────────────────────────────────
  // Called from both the progress-threshold effect and the onEnded handler so
  // either path can trigger completion, but only fires once per URL.
  function fireCompletion() {
    if (completionFiredRef.current || !onProgressUpdate) return;
    completionFiredRef.current = true;
    onProgressUpdate({
      ...progressData,
      // For YouTube report the last real played fraction; for uploads it's 1
      progressValue: isYoutube ? ytStateRef.current.lastPlayed : 1,
    });
  }

  // ── Progress-based threshold detection ────────────────────────────────────
  useEffect(() => {
    const threshold = isYoutube ? 0.85 : 1;
    if (played >= threshold) fireCompletion();
  }, [played]);

  // ── Guaranteed fallback: fire on video end ─────────────────────────────────
  function handleEnded() {
    fireCompletion();
  }

  // ── Standard player handlers ───────────────────────────────────────────────

  function handlePlayAndPause() {
    setPlaying(!playing);
  }

  function handleProgress(state) {
    if (!seeking) {
      setPlayed(state.played);
      if (isYoutube) ytStateRef.current.lastPlayed = state.played;
    }
  }

  function handleRewind() {
    playerRef?.current?.seekTo(playerRef?.current?.getCurrentTime() - 5);
  }

  function handleForward() {
    playerRef?.current?.seekTo(playerRef?.current?.getCurrentTime() + 5);
  }

  function handleToggleMute() {
    setMuted(!muted);
  }

  function handleSeekChange(newValue) {
    setPlayed(newValue[0]);
    setSeeking(true);
  }

  function handleSeekMouseUp() {
    setSeeking(false);
    playerRef.current?.seekTo(played);
  }

  function handleVolumeChange(newValue) {
    setVolume(newValue[0]);
  }

  function handlePlaybackSpeedChange(speed) {
    setPlaybackSpeed(speed);
    setShowSpeedMenu(false);
  }

  function pad(string) {
    return ("0" + string).slice(-2);
  }

  function formatTime(seconds) {
    const date = new Date(seconds * 1000);
    const hh = date.getUTCHours();
    const mm = date.getUTCMinutes();
    const ss = pad(date.getUTCSeconds());
    if (hh) return `${hh}:${pad(mm)}:${ss}`;
    return `${mm}:${ss}`;
  }

  const handleFullScreen = useCallback(() => {
    if (!isFullScreen) {
      if (playerContainerRef?.current.requestFullscreen) {
        playerContainerRef?.current?.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  }, [isFullScreen]);

  function handleMouseMove() {
    setShowControls(true);
    clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => setShowControls(false), 3000);
  }

  useEffect(() => {
    const handleFullScreenChange = () => {
      setIsFullScreen(document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullScreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullScreenChange);
    };
  }, []);

  return (
    <div
      ref={playerContainerRef}
      className={`relative bg-gray-900 rounded-lg overflow-hidden shadow-2xl transition-all duration-300 ease-in-out
      ${isFullScreen ? "w-screen h-screen" : ""}
      `}
      style={{ width, height }}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setShowControls(false)}
    >
      <ReactPlayer
        ref={playerRef}
        className="absolute top-0 left-0"
        width="100%"
        height="100%"
        url={url}
        playing={playing}
        volume={volume}
        muted={muted}
        playbackRate={playbackSpeed}
        onProgress={handleProgress}
        onEnded={handleEnded}
        onDuration={(d) => onDuration && onDuration(d)}
        controls={isYoutube}
        config={
          isYoutube
            ? { youtube: { playerVars: { rel: 0, modestbranding: 1 } } }
            : undefined
        }
      />

      {/* Custom controls — only for uploaded videos */}
      {showControls && !isYoutube && (
        <div
          className={`absolute bottom-0 left-0 right-0 bg-gray-800 bg-opacity-75 p-4 transition-opacity duration-300 ${
            showControls ? "opacity-100" : "opacity-0"
          }`}
        >
          <div
            className="w-full mb-4 py-2 cursor-pointer"
            onMouseEnter={() => setIsProgressHovered(true)}
            onMouseLeave={() => setIsProgressHovered(false)}
          >
            <Slider
              value={[played * 100]}
              max={100}
              step={0.1}
              onValueChange={(value) => handleSeekChange([value[0] / 100])}
              onValueCommit={handleSeekMouseUp}
              className={[
                "w-full origin-center transition-transform duration-200",
                isProgressHovered ? "scale-x-[1.02] scale-y-[1.2]" : "",
                "[&>span:first-child]:transition-all [&>span:first-child]:duration-200",
                "[&>span:first-child]:bg-white/30",
                isProgressHovered
                  ? "[&>span:first-child]:h-[5px]"
                  : "[&>span:first-child]:h-[3px]",
                "[&>span:first-child>span]:bg-white",
                "[&>span[role=slider]]:bg-white [&>span[role=slider]]:border-0",
                "[&>span[role=slider]]:shadow-[0_0_0_3px_rgba(255,255,255,0.25)]",
                "[&>span[role=slider]]:transition-all [&>span[role=slider]]:duration-150",
                isProgressHovered
                  ? "[&>span[role=slider]]:opacity-100 [&>span[role=slider]]:scale-100"
                  : "[&>span[role=slider]]:opacity-0 [&>span[role=slider]]:scale-75",
              ].join(" ")}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={handlePlayAndPause}
                className="text-white bg-transparent hover:text-white hover:bg-gray-700"
              >
                {playing ? (
                  <Pause className="h-6 w-6" />
                ) : (
                  <Play className="h-6 w-6" />
                )}
              </Button>
              <Button
                onClick={handleRewind}
                className="text-white bg-transparent hover:text-white hover:bg-gray-700"
                variant="ghost"
                size="icon"
              >
                <RotateCcw className="h-6 w-6" />
              </Button>
              <Button
                onClick={handleForward}
                className="text-white bg-transparent hover:text-white hover:bg-gray-700"
                variant="ghost"
                size="icon"
              >
                <RotateCw className="h-6 w-6" />
              </Button>
              <Button
                onClick={handleToggleMute}
                className="text-white bg-transparent hover:text-white hover:bg-gray-700"
                variant="ghost"
                size="icon"
              >
                {muted ? (
                  <VolumeX className="h-6 w-6" />
                ) : (
                  <Volume2 className="h-6 w-6" />
                )}
              </Button>
              <Slider
                value={[volume * 100]}
                max={100}
                step={1}
                onValueChange={(value) => handleVolumeChange([value[0] / 100])}
                className="w-24"
              />
            </div>

            <div className="flex items-center space-x-2">
              <div className="text-white">
                {formatTime(played * (playerRef?.current?.getDuration() || 0))}/{" "}
                {formatTime(playerRef?.current?.getDuration() || 0)}
              </div>
              <div className="relative">
                <Button
                  className="text-white bg-transparent hover:text-white hover:bg-gray-700"
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowSpeedMenu(!showSpeedMenu)}
                >
                  <Zap className="h-6 w-6" />
                </Button>
                {showSpeedMenu && (
                  <div className="absolute bottom-full right-0 mb-2 bg-gray-900 border border-gray-700 rounded-lg shadow-lg z-50 min-w-max">
                    {[0.5, 0.75, 1, 1.25, 1.5, 1.75, 2].map((speed) => (
                      <button
                        key={speed}
                        onClick={() => handlePlaybackSpeedChange(speed)}
                        className={`block w-full text-left px-4 py-2 text-sm transition-colors ${
                          playbackSpeed === speed
                            ? "bg-blue-600 text-white font-semibold"
                            : "text-gray-300 hover:bg-gray-800"
                        }`}
                      >
                        {speed}x
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <Button
                className="text-white bg-transparent hover:text-white hover:bg-gray-700"
                variant="ghost"
                size="icon"
                onClick={handleFullScreen}
              >
                {isFullScreen ? (
                  <Minimize className="h-6 w-6" />
                ) : (
                  <Maximize className="h-6 w-6" />
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default VideoPlayer;
