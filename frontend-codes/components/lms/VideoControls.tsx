
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  VolumeX, 
  Maximize,
  Settings,
  Minimize
} from 'lucide-react';
import { VideoSettingsMenu } from '@/components/lms/VideoSettingsMenu';
import { CaptionsToggle } from '@/components/lms/CaptionsToggle';
import { cn } from '@/lib/utils';

interface VideoControlsProps {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  playbackRate: number;
  videoQuality: string;
  captionsEnabled: boolean;
  availableQualities: string[];
  showControls: boolean;
  onTogglePlay: () => void;
  onSeek: (time: number) => void;
  onSkipForward: () => void;
  onSkipBackward: () => void;
  onVolumeChange: (volume: number) => void;
  onToggleMute: () => void;
  onPlaybackRateChange: (rate: number) => void;
  onQualityChange: (quality: string) => void;
  onToggleCaptions: () => void;
  onToggleFullscreen: () => void;
  isFullscreen?: boolean;
}

export const VideoControls: React.FC<VideoControlsProps> = ({
  isPlaying,
  currentTime,
  duration,
  volume,
  isMuted,
  playbackRate,
  videoQuality,
  captionsEnabled,
  availableQualities,
  showControls,
  onTogglePlay,
  onSeek,
  onSkipForward,
  onSkipBackward,
  onVolumeChange,
  onToggleMute,
  onPlaybackRateChange,
  onQualityChange,
  onToggleCaptions,
  onToggleFullscreen,
  isFullscreen
}) => {
  const [isDragging, setIsDragging] = useState(false);

  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const newTime = (clickX / rect.width) * duration;
    onSeek(newTime);
  };

  const handleProgressMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    handleProgressClick(e);
  };

  const handleProgressMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isDragging) {
      handleProgressClick(e);
    }
  };

  const handleProgressMouseUp = () => {
    setIsDragging(false);
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div 
      className={cn(
        "absolute inset-0 flex flex-col justify-end transition-opacity duration-300",
        showControls ? "opacity-100" : "opacity-0 group-hover:opacity-100"
      )}
    >
      {/* Dark gradient overlay for bottom controls visibility */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />

      {/* Center Play Button Overlay (Only when paused) */}
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-auto">
          <Button
            size="icon"
            className="w-20 h-20 rounded-full bg-[#fdb606] hover:bg-[#e0a205] text-white shadow-xl transition-transform duration-200 hover:scale-110 flex items-center justify-center pl-2"
            onClick={onTogglePlay}
          >
            <Play className="w-10 h-10 fill-current" />
          </Button>
        </div>
      )}

      {/* Bottom Control Bar */}
      <div className="relative z-10 px-4 pb-4 pt-8 space-y-2 pointer-events-auto">
        
        {/* Progress Bar */}
        <div 
          className="relative h-1.5 w-full bg-white/30 rounded-full cursor-pointer group/progress touch-none"
          onClick={handleProgressClick}
          onMouseDown={handleProgressMouseDown}
          onMouseMove={handleProgressMouseMove}
          onMouseUp={handleProgressMouseUp}
          onMouseLeave={handleProgressMouseUp}
        >
          {/* Progress fill */}
          <div 
            className="absolute top-0 left-0 h-full bg-[#fdb606] rounded-full"
            style={{ width: `${progress}%` }}
          />
          
          {/* Handle (visible on hover) */}
          <div 
            className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-md scale-0 group-hover/progress:scale-100 transition-transform duration-200"
            style={{ left: `${progress}%` }}
          />
        </div>

        {/* Controls Row */}
        <div className="flex items-center justify-between text-white">
          
          {/* Left: Playback & Volume */}
          <div className="flex items-center spacing-x-1 sm:spacing-x-4 gap-2">
            
            <Button 
              size="icon" 
              variant="ghost" 
              className="text-white hover:bg-white/10 w-9 h-9 transition-colors"
              onClick={onTogglePlay}
            >
              {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
            </Button>

            <span className="text-xs font-medium min-w-[3rem]">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>

            {/* Volume Control */}
            <div className="hidden sm:flex items-center group/volume hover:bg-black/40 rounded-full pr-2 transition-colors">
              <Button 
                size="icon" 
                variant="ghost" 
                className="text-white hover:bg-white/10 w-9 h-9 transition-colors rounded-full"
                onClick={onToggleMute}
              >
                {isMuted || volume === 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </Button>
              <div className="w-0 overflow-hidden transition-all duration-300 group-hover/volume:w-24">
                <Slider
                  value={[isMuted ? 0 : volume * 100]}
                  onValueChange={(val) => onVolumeChange(val[0] / 100)}
                  max={100}
                  step={1}
                  className="w-20 cursor-pointer [&_.bg-primary]:bg-[#fdb606] [&_.border-primary]:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Right: Settings, Captions, Fullscreen */}
          <div className="flex items-center gap-1 sm:gap-2">
            
             <span className="text-xs font-medium text-white/80 px-2 border-r border-white/20 hidden md:inline-block">
                {parseFloat(playbackRate.toString())}x
             </span>

            {/* Skip Buttons (Optional, kept small) */}
            <div className="flex items-center hidden sm:flex">
                <Button variant="ghost" size="icon" className="w-8 h-8 text-white/80 hover:bg-white/10" onClick={onSkipBackward} title="-10s">
                    <SkipBack className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" className="w-8 h-8 text-white/80 hover:bg-white/10" onClick={onSkipForward} title="+10s">
                    <SkipForward className="w-4 h-4" />
                </Button>
            </div>

            {/* Video Settings */}
            <VideoSettingsMenu
              playbackRate={playbackRate}
              videoQuality={videoQuality}
              captionsEnabled={captionsEnabled}
              availableQualities={availableQualities}
              onPlaybackRateChange={onPlaybackRateChange}
              onQualityChange={onQualityChange}
              onToggleCaptions={onToggleCaptions}
            />

            <Button 
              size="icon" 
              variant="ghost" 
              className="text-white hover:bg-white/10 w-9 h-9 transition-colors"
              onClick={onToggleFullscreen}
            >
              {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

