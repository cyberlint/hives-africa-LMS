"use client";
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { VideoPlayer } from '@/components/lms/VideoPlayer';
import { VideoControls } from '@/components/lms/VideoControls';
import { CheckCircle } from 'lucide-react';
import type { Lecture } from '@/types/course';
import { NavigationArrows } from '@/components/lms/NavigationArrows';
import { RichTextRenderer } from './RichTextRenderer';
import { cn } from "@/lib/utils";

interface VideoPlayerSectionProps {
  lecture?: Lecture;
  onNext: () => void;
  onPrevious: () => void;
  isCompleted: boolean;
  onVideoEnd: () => void;
  onTimeUpdate?: (time: number) => void;
  allLectures: Lecture[];
  currentIndex: number;
}
export const VideoPlayerSection: React.FC<VideoPlayerSectionProps> = ({
  lecture, onNext, onPrevious, isCompleted, onVideoEnd, onTimeUpdate, allLectures, currentIndex
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

  // --- KEEPING YOUR ORIGINAL LOGIC START ---
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const updateTime = () => { setCurrentTime(video.currentTime); onTimeUpdate?.(video.currentTime); };
    const updateDuration = () => setDuration(video.duration);
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleLoadStart = () => setIsLoading(true);
    const handleCanPlay = () => setIsLoading(false);
    const handleEnded = () => { setIsPlaying(false); onVideoEnd(); setTimeout(() => { onNext(); }, 2000); };

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
  }, [onNext, onVideoEnd, onTimeUpdate]);

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
    isPlaying ? video.pause() : video.play();
  }, [isPlaying]);

  const handleSeek = useCallback((time: number) => {
    if (videoRef.current) { videoRef.current.currentTime = time; setCurrentTime(time); }
  }, []);

  const skipForward = useCallback(() => {
    if (videoRef.current) videoRef.current.currentTime = Math.min(videoRef.current.currentTime + 10, duration);
  }, [duration]);

  const skipBackward = useCallback(() => {
    if (videoRef.current) videoRef.current.currentTime = Math.max(videoRef.current.currentTime - 10, 0);
  }, []);

  const handleVolumeChange = useCallback((v: number) => {
    if (videoRef.current) { videoRef.current.volume = v; setVolume(v); setIsMuted(v === 0); }
  }, []);

  const toggleMute = useCallback(() => {
    if (videoRef.current) { const m = !isMuted; videoRef.current.muted = m; setIsMuted(m); }
  }, [isMuted]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.target && (e.target as HTMLElement).tagName === 'INPUT') return;
      switch (e.code) {
        case 'Space': e.preventDefault(); togglePlay(); break;
        case 'ArrowLeft': if (!e.altKey) { e.preventDefault(); skipBackward(); } break;
        case 'ArrowRight': if (!e.altKey) { e.preventDefault(); skipForward(); } break;
        case 'KeyM': e.preventDefault(); toggleMute(); break;
      }
    };
    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [togglePlay, skipForward, skipBackward, toggleMute]);
  // --- KEEPING YOUR ORIGINAL LOGIC END ---

  if (!lecture) return <div className="h-full bg-black flex items-center justify-center text-gray-400">Select a lecture</div>;

  return (
    <div className="h-full flex flex-col bg-black overflow-hidden">
      
      {/* 1. VIDEO AREA - This now scales to fill width using aspect-video */}
      <div className="relative w-full aspect-video bg-black group shrink-0">
        {isLoading && (
          <div className="absolute inset-0 bg-black flex items-center justify-center z-10 text-white animate-pulse">
            Loading video...
          </div>
        )}

        <div className="relative h-full w-full">
          <VideoPlayer
            ref={videoRef}
            src={lecture.videoUrl || defaultVideoUrl}
            onMouseEnter={() => setShowControls(true)}
            onMouseLeave={() => setShowControls(false)}
          />

          <NavigationArrows
            canGoPrevious={currentIndex > 0}
            canGoNext={currentIndex < allLectures.length - 1}
            onPrevious={onPrevious}
            onNext={onNext}
            previousTitle={currentIndex > 0 ? allLectures[currentIndex - 1].title : ''}
            nextTitle={currentIndex < allLectures.length - 1 ? allLectures[currentIndex + 1].title : ''}
          />
        </div>

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
          onPlaybackRateChange={(r) => { if(videoRef.current) videoRef.current.playbackRate = r; setPlaybackRate(r); }}
          onQualityChange={setVideoQuality}
          onToggleCaptions={() => setCaptionsEnabled(!captionsEnabled)}
          onToggleFullscreen={() => {
            if (document.fullscreenElement) document.exitFullscreen();
            else videoRef.current?.requestFullscreen();
          }}
        />
      </div>

      {/* 2. INFO AREA - Takes remaining space below the video */}
      <div className="flex-1 bg-[#1a1c1e] border-t border-[#2d2f31] overflow-y-auto custom-scrollbar">
        <div className="p-6">
          <h2 className="text-xl font-bold text-white mb-3">{lecture.title}</h2>
          {lecture.description && (
            <div className="text-gray-400 text-sm mb-4 leading-relaxed">
              <RichTextRenderer 
                contentJsonString={lecture.description} 
                className="prose prose-sm dark:prose-invert max-w-none text-gray-400" 
              />
            </div>
          )}
          
          <div className="flex items-center gap-4 text-xs text-gray-500 uppercase tracking-wider">
            <span>Lecture {lecture.id}</span>
            {isCompleted && <span className="text-green-500 flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Completed</span>}
          </div>

          {/* Attachments grid */}
          {lecture.attachments && lecture.attachments.length > 0 && (
            <div className="mt-8 grid grid-cols-1 gap-3">
              <h3 className="text-sm font-semibold text-gray-300">Resources</h3>
              {lecture.attachments.map((att) => (
                <a key={att.id} href={att.url} target="_blank" className="p-3 bg-[#2d2f31] rounded-md hover:bg-[#3e4143] transition-colors flex justify-between items-center text-sm text-white group">
                  <span className="group-hover:text-[#fdb606] transition-colors">{att.title}</span>
                  <span className="text-xs text-gray-500">{att.type}</span>
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};