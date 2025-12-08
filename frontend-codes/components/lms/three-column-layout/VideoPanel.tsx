import React, { useState, useRef, useEffect, useCallback } from 'react';
import { VideoPlayer } from '@/components/lms/VideoPlayer';
import { VideoControls } from '@/components/lms/VideoControls';
import { Button } from '@/components/ui/button';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import type { Lecture } from '@/types/course';

interface VideoPanelProps {
  lecture?: Lecture;
  onTimeUpdate?: (time: number) => void;
  onVideoEnd?: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  isMobile?: boolean;
}

export const VideoPanel: React.FC<VideoPanelProps> = ({
  lecture,
  onTimeUpdate,
  onVideoEnd,
  isCollapsed,
  onToggleCollapse,
  isMobile = false,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showControls, setShowControls] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [videoQuality, setVideoQuality] = useState('Auto');
  const [captionsEnabled, setCaptionsEnabled] = useState(false);
  const [availableQualities] = useState(['Auto', '1080p', '720p', '480p', '360p']);

  const defaultVideoUrl = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateTime = () => {
      const time = video.currentTime;
      setCurrentTime(time);
      onTimeUpdate?.(time);
    };
    const updateDuration = () => setDuration(video.duration);
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleLoadStart = () => setIsLoading(true);
    const handleCanPlay = () => setIsLoading(false);
    const handleEnded = () => {
      setIsPlaying(false);
      onVideoEnd?.();
    };

    video.addEventListener('timeupdate', updateTime);
    video.addEventListener('loadedmetadata', updateDuration);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('loadstart', handleLoadStart);
    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('ended', handleEnded);

    return () => {
      video.removeEventListener('timeupdate', updateTime);
      video.removeEventListener('loadedmetadata', updateDuration);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('loadstart', handleLoadStart);
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('ended', handleEnded);
    };
  }, [onVideoEnd, onTimeUpdate]);

  // Reset video when lecture changes
  useEffect(() => {
    if (videoRef.current) {
      setCurrentTime(0);
      setIsPlaying(false);
      videoRef.current.currentTime = 0;
    }
  }, [lecture?.id]);

  const togglePlay = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
    } else {
      video.play();
    }
  }, [isPlaying]);

  const handleSeek = useCallback((time: number) => {
    const video = videoRef.current;
    if (!video) return;

    video.currentTime = time;
    setCurrentTime(time);
  }, []);

  const skipForward = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    video.currentTime = Math.min(video.currentTime + 10, duration);
  }, [duration]);

  const skipBackward = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    video.currentTime = Math.max(video.currentTime - 10, 0);
  }, []);

  const handleVolumeChange = useCallback((newVolume: number) => {
    const video = videoRef.current;
    if (!video) return;

    video.volume = newVolume;
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  }, []);

  const toggleMute = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    const newMuted = !isMuted;
    video.muted = newMuted;
    setIsMuted(newMuted);
  }, [isMuted]);

  const changePlaybackRate = (rate: number) => {
    const video = videoRef.current;
    if (!video) return;

    video.playbackRate = rate;
    setPlaybackRate(rate);
  };

  const handleQualityChange = (quality: string) => {
    setVideoQuality(quality);
  };

  const toggleCaptions = () => {
    setCaptionsEnabled(!captionsEnabled);
  };

  const toggleFullscreen = () => {
    const video = videoRef.current;
    if (!video) return;

    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      video.requestFullscreen();
    }
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.target && (e.target as HTMLElement).tagName === 'INPUT') return;
      if (e.target && (e.target as HTMLElement).tagName === 'TEXTAREA') return;

      switch (e.code) {
        case 'Space':
          e.preventDefault();
          togglePlay();
          break;
        case 'ArrowLeft':
          if (!e.altKey) {
            e.preventDefault();
            skipBackward();
          }
          break;
        case 'ArrowRight':
          if (!e.altKey) {
            e.preventDefault();
            skipForward();
          }
          break;
        case 'KeyF':
          e.preventDefault();
          toggleFullscreen();
          break;
        case 'KeyM':
          e.preventDefault();
          toggleMute();
          break;
        case 'ArrowUp':
          e.preventDefault();
          handleVolumeChange(Math.min(volume + 0.1, 1));
          break;
        case 'ArrowDown':
          e.preventDefault();
          handleVolumeChange(Math.max(volume - 0.1, 0));
          break;
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [volume, togglePlay, skipForward, skipBackward, toggleMute, handleVolumeChange]);

  if (isCollapsed) {
    return (
      <div className="fixed right-0 top-[80px] border-l h-[calc(100vh-80px)] z-20 lg:relative lg:top-0 lg:h-full">
        <div className="h-full flex items-center">
          <Button 
            variant="ghost"
            size="sm"
            onClick={onToggleCollapse}
            className="text-gray-700 hover:bg-gray-100 p-3 rounded-l-lg rounded-r-none bg-white border border-gray-200 shadow-lg transition-all duration-200"
            title="Show video"
            aria-label="Show video player"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
        </div>
      </div>
    );
  }

  if (!lecture || !lecture.videoUrl) {
    return null;
  }

  return (
    <div 
      className={`
        h-full bg-white border-l border-r border-gray-200 flex flex-col p-1
        ${isMobile ? 'w-full' : 'w-[480px]'}
        transition-all duration-300 ease-in-out
      `}
    >
      {/* Header */}
      <div className="flex-shrink-0 p-4 border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-900">Video</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleCollapse}
            className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 p-2 transition-colors"
            title="Hide video"
            aria-label="Hide video player"
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Video Player */}
      <div className="flex-1 min-h-0 relative group">
        {isLoading && (
          <div className="absolute inset-0 bg-black flex items-center justify-center z-10">
            <div className="text-white text-sm">Loading video...</div>
          </div>
        )}

        <div className="relative h-full w-full">
          <VideoPlayer
            ref={videoRef}
            src={lecture.videoUrl || defaultVideoUrl}
            onMouseEnter={() => setShowControls(true)}
            onMouseLeave={() => setShowControls(false)}
          />

          {/* Video Controls */}
          <VideoControls
            isPlaying={isPlaying}
            currentTime={currentTime}
            duration={duration}
            volume={volume}
            isMuted={isMuted}
            playbackRate={playbackRate}
            videoQuality={videoQuality}
            captionsEnabled={captionsEnabled}
            availableQualities={availableQualities}
            showControls={showControls}
            onTogglePlay={togglePlay}
            onSeek={handleSeek}
            onSkipForward={skipForward}
            onSkipBackward={skipBackward}
            onVolumeChange={handleVolumeChange}
            onToggleMute={toggleMute}
            onPlaybackRateChange={changePlaybackRate}
            onQualityChange={handleQualityChange}
            onToggleCaptions={toggleCaptions}
            onToggleFullscreen={toggleFullscreen}
          />
        </div>
      </div>

      {/* Video Info */}
      <div className="flex-shrink-0 p-4  bg-white">
        <h4 className="text-sm font-medium text-gray-900 mb-1 line-clamp-2">
          {lecture.title}
        </h4>
        {lecture.description && (
          <p className="text-xs text-gray-600 line-clamp-2">
            {lecture.description}
          </p>
        )}
      </div>
    </div>
  );
};
