// import React, { useState, useRef, useEffect, useCallback } from 'react';
// import { VideoPlayer } from '@/components/lms/VideoPlayer';
// import { VideoControls } from '@/components/lms/VideoControls';
// import { Button } from '@/components/ui/button';
// import { ChevronRight, ChevronLeft } from 'lucide-react';
// import type { Lecture, CourseData } from '@/types/course';
// import { constructUrl } from '@/lib/construct-url';
// import { cn } from '@/lib/utils';
// import { TranscriptToggle } from '@/components/TranscriptToggle';

// // Define the transcript content
// const videoTranscript = `
// We're still working on this feature. 👩‍💻 The transcript for this video will be available soon.
// `;

// interface VideoPanelProps {
//   lecture?: Lecture;
//   courseData?: CourseData;
//   onTimeUpdate?: (time: number) => void;
//   onVideoEnd?: () => void;
//   isCollapsed: boolean;
//   onToggleCollapse: () => void;
//   isMobile?: boolean;
// }

// export const VideoPanel: React.FC<VideoPanelProps> = ({
//   lecture,
//   courseData,
//   onTimeUpdate,
//   onVideoEnd,
//   isCollapsed,
//   onToggleCollapse,
//   isMobile = false,
// }) => {
//   const videoRef = useRef<HTMLVideoElement>(null);
//   const [isPlaying, setIsPlaying] = useState(false);
//   const [currentTime, setCurrentTime] = useState(0);
//   const [duration, setDuration] = useState(0);
//   const [volume, setVolume] = useState(1);
//   const [isMuted, setIsMuted] = useState(false);
//   const [playbackRate, setPlaybackRate] = useState(1);
//   const [showControls, setShowControls] = useState(true);
//   const [isLoading, setIsLoading] = useState(false);
//   const [videoQuality, setVideoQuality] = useState('Auto');
//   const [captionsEnabled, setCaptionsEnabled] = useState(false);
//   const [availableQualities] = useState(['Auto', '1080p', '720p', '480p', '360p']);
//   const [activeTab, setActiveTab] = useState("overview");

//   const defaultVideoUrl = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';

//   useEffect(() => {
//     const video = videoRef.current;
//     if (!video) return;

//     const updateTime = () => {
//       const time = video.currentTime;
//       setCurrentTime(time);
//       onTimeUpdate?.(time);
//     };
//     const updateDuration = () => setDuration(video.duration);
//     const handlePlay = () => setIsPlaying(true);
//     const handlePause = () => setIsPlaying(false);
//     const handleLoadStart = () => setIsLoading(true);
//     const handleCanPlay = () => setIsLoading(false);
//     const handleEnded = () => {
//       setIsPlaying(false);
//       onVideoEnd?.();
//     };

//     video.addEventListener('timeupdate', updateTime);
//     video.addEventListener('loadedmetadata', updateDuration);
//     video.addEventListener('play', handlePlay);
//     video.addEventListener('pause', handlePause);
//     video.addEventListener('loadstart', handleLoadStart);
//     video.addEventListener('canplay', handleCanPlay);
//     video.addEventListener('ended', handleEnded);

//     return () => {
//       video.removeEventListener('timeupdate', updateTime);
//       video.removeEventListener('loadedmetadata', updateDuration);
//       video.removeEventListener('play', handlePlay);
//       video.removeEventListener('pause', handlePause);
//       video.removeEventListener('loadstart', handleLoadStart);
//       video.removeEventListener('canplay', handleCanPlay);
//       video.removeEventListener('ended', handleEnded);
//     };
//   }, [onVideoEnd, onTimeUpdate]);

//   // Reset video when lecture changes
//   useEffect(() => {
//     if (videoRef.current) {
//       setCurrentTime(0);
//       setIsPlaying(false);
//       videoRef.current.currentTime = 0;
//     }
//   }, [lecture?.id]);

//   const togglePlay = useCallback(() => {
//     const video = videoRef.current;
//     if (!video) return;

//     if (isPlaying) {
//       video.pause();
//     } else {
//       video.play();
//     }
//   }, [isPlaying]);

//   const handleSeek = useCallback((time: number) => {
//     const video = videoRef.current;
//     if (!video) return;

//     video.currentTime = time;
//     setCurrentTime(time);
//   }, []);

//   const skipForward = useCallback(() => {
//     const video = videoRef.current;
//     if (!video) return;

//     video.currentTime = Math.min(video.currentTime + 10, duration);
//   }, [duration]);

//   const skipBackward = useCallback(() => {
//     const video = videoRef.current;
//     if (!video) return;

//     video.currentTime = Math.max(video.currentTime - 10, 0);
//   }, []);

//   const handleVolumeChange = useCallback((newVolume: number) => {
//     const video = videoRef.current;
//     if (!video) return;

//     video.volume = newVolume;
//     setVolume(newVolume);
//     setIsMuted(newVolume === 0);
//   }, []);

//   const toggleMute = useCallback(() => {
//     const video = videoRef.current;
//     if (!video) return;

//     const newMuted = !isMuted;
//     video.muted = newMuted;
//     setIsMuted(newMuted);
//   }, [isMuted]);

//   const changePlaybackRate = (rate: number) => {
//     const video = videoRef.current;
//     if (!video) return;

//     video.playbackRate = rate;
//     setPlaybackRate(rate);
//   };

//   const handleQualityChange = (quality: string) => {
//     setVideoQuality(quality);
//   };

//   const toggleCaptions = () => {
//     setCaptionsEnabled(!captionsEnabled);
//   };

//   const toggleFullscreen = () => {
//     const video = videoRef.current;
//     if (!video) return;

//     if (document.fullscreenElement) {
//       document.exitFullscreen();
//     } else {
//       video.requestFullscreen();
//     }
//   };

//   // Memoized handlers to keep dependence stable
//   const handlers = React.useMemo(() => ({
//       togglePlay,
//       toggleFullscreen,
//       toggleMute,
//       handleVolumeChange,
//       volume
//   }), [togglePlay, toggleFullscreen, toggleMute, handleVolumeChange, volume]);


//   // Optimized Keyboard shortcuts
//   useEffect(() => {
//     const handleKeyPress = (e: KeyboardEvent) => {
//       if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) return;

//       switch (e.code) {
//         case 'Space':
//           e.preventDefault();
//           handlers.togglePlay();
//           break;
//         case 'KeyF':
//           e.preventDefault();
//           handlers.toggleFullscreen();
//           break;
//         case 'KeyM':
//           e.preventDefault();
//           handlers.toggleMute();
//           break;
//         case 'ArrowUp':
//           e.preventDefault();
//           handlers.handleVolumeChange(Math.min(handlers.volume + 0.1, 1));
//           break;
//         case 'ArrowDown':
//           e.preventDefault();
//           handlers.handleVolumeChange(Math.max(handlers.volume - 0.1, 0));
//           break;
//       }
//     };
//     document.addEventListener('keydown', handleKeyPress);
//     return () => document.removeEventListener('keydown', handleKeyPress);
//   }, [handlers]);

//   const videoSrc = lecture?.videoUrl || (lecture?.videoKey ? constructUrl(lecture.videoKey) : undefined);

//   if (isCollapsed) {
//     return (
//       <div className="fixed right-0 top-[80px] border-l border-gray-200 dark:border-gray-800 h-[calc(100vh-80px)] z-20 lg:relative lg:top-0 lg:h-full bg-white dark:bg-[#1d2026] transition-colors duration-300">
//         <div className="h-full flex items-center">
//           <Button 
//             variant="ghost" 
//             size="sm" 
//             onClick={onToggleCollapse}
//             className="rounded-l-lg rounded-r-none bg-white dark:bg-[#1d2026] border border-gray-200 dark:border-gray-800 shadow-sm p-2 hover:bg-gray-50 dark:hover:bg-gray-800"
//           >
//             <ChevronLeft className="w-5 h-5 text-gray-500 dark:text-gray-400" />
//           </Button>
//         </div>
//       </div>
//     );
//   }

//   if (!lecture || !videoSrc) {
//     return null;
//   }

//   const whatYouWillLearn = [
//       "Setting up the environment",
//       "Advanced HTML Practices",
//       "Build a portfolio website",
//       "Responsive Designs",
//       "Understand HTML Programming",
//       "Code HTML",
//       "Start building beautiful websites"
//   ]; 

//   const faqs = [
//       {
//           question: "Do I need any prior knowledge?",
//           answer: "No, this course is designed for beginners. We start from the very basics and work our way up."
//       },
//       {
//           question: "Is there a certificate upon completion?",
//           answer: "Yes, you will receive a verifiable certificate once you complete all lectures and quizzes."
//       },
//       {
//           question: "Can I access the course on mobile?",
//           answer: "Absolutely! Our platform is fully responsive and works great on mobile devices."
//       },
//       {
//           question: "Do I have lifetime access?",
//           answer: "Yes, once you enroll, you have unlimited lifetime access to the course content and any future updates."
//       }
//   ];

//   return (
//     <div 
//       className={cn(
//         "bg-white dark:bg-[#1d2026] border-l border-r border-gray-200 dark:border-gray-800 flex flex-col transition-all duration-300 ease-in-out overflow-y-auto custom-scrollbar-on-hover",
//         isMobile ? "w-full min-h-[50vh] max-h-screen" : "w-[480px] h-full max-h-screen"
//       )}
//     >
//       {/* Video Header (Minimal) */}
//       <div className="flex-shrink-0 p-3 flex justify-between items-center bg-gray-50/50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-800 transition-colors duration-300">
//         <div className="flex items-center gap-2">
//             <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Now Playing</span>
//             <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 line-clamp-1 max-w-[200px]">{lecture.title}</h4>
//         </div>
//         <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-gray-900 dark:hover:text-gray-100" onClick={onToggleCollapse}>
//           <ChevronRight className="w-5 h-5" />
//         </Button>
//       </div>

//       {/* Video Player Container */}
//       <div 
//         className="flex-shrink-0 aspect-video bg-black relative w-full group"
//         onMouseEnter={() => setShowControls(true)}
//         onMouseLeave={() => setShowControls(false)}
//       >
//         {isLoading && (
//           <div className="absolute inset-0 bg-black flex items-center justify-center z-20">
//             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
//           </div>
//         )}

//        <VideoPlayer
//           ref={videoRef}
//           src={videoSrc || defaultVideoUrl}
//           onMouseEnter={() => setShowControls(true)}
//           onMouseLeave={() => setShowControls(false)}
//         />

//         <VideoControls
//           isPlaying={isPlaying}
//           currentTime={currentTime}
//           duration={duration}
//           volume={volume}
//           isMuted={isMuted}
//           playbackRate={playbackRate}
//           videoQuality={videoQuality}
//           captionsEnabled={captionsEnabled}
//           availableQualities={availableQualities}
//           showControls={showControls}
//           onTogglePlay={togglePlay}
//           onSeek={handleSeek}
//           onSkipForward={skipForward}
//           onSkipBackward={skipBackward}
//           onVolumeChange={handleVolumeChange}
//           onToggleMute={toggleMute}
//           onPlaybackRateChange={changePlaybackRate}
//           onQualityChange={handleQualityChange}
//           onToggleCaptions={toggleCaptions}
//           onToggleFullscreen={toggleFullscreen}
//         />
//       </div>

//       {/* Tabs Section */}
//       <div className="flex-shrink-0 flex flex-col bg-white">
//         <TranscriptToggle transcriptContent={videoTranscript} />
//       </div>
//     </div>
//   );
// };


import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { VideoPlayer } from '@/components/lms/VideoPlayer';
import { VideoControls } from '@/components/lms/VideoControls';
import { Button } from '@/components/ui/button';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import type { Lecture, CourseData } from '@/types/course';
import { constructUrl } from '@/lib/construct-url';
import { cn } from '@/lib/utils';
import { TranscriptToggle } from '@/components/TranscriptToggle';

// --- Constants ---
const VIDEO_TRANSCRIPT = `
We're still working on this feature. 👩‍💻 The transcript for this video will be available soon.
`;
const DEFAULT_VIDEO_URL = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';
const AVAILABLE_QUALITIES = ['Auto', '1080p', '720p', '480p', '360p'];

interface VideoPanelProps {
  lecture?: Lecture;
  courseData?: CourseData;
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

  // --- Video State Management ---
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
  
  // Tab state (retained)
  const [activeTab, setActiveTab] = useState("overview");

  // --- Handlers ---
  const togglePlay = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
    } else {
      video.play().catch(error => console.error("Video playback failed:", error));
    }
    setIsPlaying(prev => !prev);
  }, [isPlaying]);

  const handleSeek = useCallback((time: number) => {
    const video = videoRef.current;
    if (!video) return;

    video.currentTime = time;
    setCurrentTime(time);
  }, []);

  const skipBy = useCallback((delta: number) => {
    const video = videoRef.current;
    if (!video) return;

    const newTime = Math.max(0, Math.min(video.currentTime + delta, duration));
    video.currentTime = newTime;
    setCurrentTime(newTime);
  }, [duration]);

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

  const changePlaybackRate = useCallback((rate: number) => {
    const video = videoRef.current;
    if (!video) return;

    video.playbackRate = rate;
    setPlaybackRate(rate);
  }, []);

  const toggleFullscreen = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      video.requestFullscreen();
    }
  }, []);
  
  const handlers = useMemo(() => ({
    togglePlay,
    toggleFullscreen,
    toggleMute,
    handleVolumeChange,
    volume
  }), [togglePlay, toggleFullscreen, toggleMute, handleVolumeChange, volume]);


  // --- Effects ---

  // Video Event Listeners
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
      if (videoRef.current.pause) {
        videoRef.current.pause();
      }
    }
  }, [lecture?.id]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) return;

      switch (e.code) {
        case 'Space':
          e.preventDefault();
          handlers.togglePlay();
          break;
        case 'KeyF':
          e.preventDefault();
          handlers.toggleFullscreen();
          break;
        case 'KeyM':
          e.preventDefault();
          handlers.toggleMute();
          break;
        case 'ArrowRight':
          e.preventDefault();
          skipBy(10);
          break;
        case 'ArrowLeft':
          e.preventDefault();
          skipBy(-10);
          break;
        case 'ArrowUp':
          e.preventDefault();
          handlers.handleVolumeChange(Math.min(handlers.volume + 0.1, 1));
          break;
        case 'ArrowDown':
          e.preventDefault();
          handlers.handleVolumeChange(Math.max(handlers.volume - 0.1, 0));
          break;
      }
    };
    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [handlers, skipBy]);
  
  const videoSrc = lecture?.videoUrl || (lecture?.videoKey ? constructUrl(lecture.videoKey) : undefined);

  // --- Collapsed View ---
  if (isCollapsed) {
    return (
      <div className="fixed right-0 top-[80px] border-l border-gray-200 dark:border-gray-800 h-[calc(100vh-80px)] z-20 lg:relative lg:top-0 lg:h-full bg-white dark:bg-[#1d2026] transition-colors duration-300 flex items-center">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onToggleCollapse}
          className="rounded-l-lg rounded-r-none bg-white dark:bg-[#1d2026] border border-gray-200 dark:border-gray-800 shadow-sm p-2 hover:bg-gray-50 dark:hover:bg-gray-800"
        >
          <ChevronLeft className="w-5 h-5 text-gray-500 dark:text-gray-400" />
        </Button>
      </div>
    );
  }

  // --- No Lecture/Source View ---
  if (!lecture || !videoSrc) {
    return (
        <div className={cn(
            "bg-white dark:bg-[#1d2026] border-l border-r border-gray-200 dark:border-gray-800 flex items-center justify-center transition-all duration-300",
            isMobile ? "w-full min-h-[50vh]" : "w-[480px] h-full"
        )}>
            <p className="text-gray-500 dark:text-gray-400">Select a lecture to begin.</p>
        </div>
    );
  }


  // --- Main Panel View (The Fixed Layout) ---
  return (
    <div 
      className={cn(
        // Main container must be flex-col and take up all available height (h-full)
        "bg-white dark:bg-[#1d2026] border-l border-r border-gray-200 dark:border-gray-800 flex flex-col transition-all duration-300 ease-in-out **h-full**", 
        isMobile ? "w-full min-h-[50vh] max-h-screen" : "w-[480px] max-h-screen"
      )}
    >
      
      {/* 1. Video Header: Fixed size using flex-shrink-0 */}
      <div className="flex-shrink-0 p-3 flex justify-between items-center bg-gray-50/50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-800 transition-colors duration-300">
        <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Now Playing</span>
            <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 line-clamp-1 max-w-[200px]">{lecture.title}</h4>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8 text-gray-400 hover:text-gray-900 dark:hover:text-gray-100" 
          onClick={onToggleCollapse}
        >
          <ChevronRight className="w-5 h-5" />
        </Button>
      </div>

      {/* 2. Video Player Container: Fixed size using flex-shrink-0 and aspect-ratio */}
      <div 
        className="**flex-shrink-0 aspect-video** bg-black relative w-full group" 
        onMouseEnter={() => setShowControls(true)}
        onMouseLeave={() => setShowControls(false)}
      >
        {isLoading && (
          <div className="absolute inset-0 bg-black flex items-center justify-center z-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          </div>
        )}

       <VideoPlayer
          ref={videoRef}
          src={videoSrc || DEFAULT_VIDEO_URL}
        />

        <VideoControls
          isPlaying={isPlaying}
          currentTime={currentTime}
          duration={duration}
          volume={volume}
          isMuted={isMuted}
          playbackRate={playbackRate}
          videoQuality={videoQuality}
          captionsEnabled={captionsEnabled}
          availableQualities={AVAILABLE_QUALITIES}
          showControls={showControls}
          onTogglePlay={togglePlay}
          onSeek={handleSeek}
          onSkipForward={() => skipBy(10)}
          onSkipBackward={() => skipBy(-10)}
          onVolumeChange={handleVolumeChange}
          onToggleMute={toggleMute}
          onPlaybackRateChange={changePlaybackRate}
          onQualityChange={setVideoQuality}
          onToggleCaptions={() => setCaptionsEnabled(prev => !prev)}
          onToggleFullscreen={toggleFullscreen}
        />
      </div>

      {/* 3. Tabs Section: Set to flex-1 to fill the remaining space, and handle its own scrolling */}
      <div 
        className="**flex-1 overflow-y-auto** flex flex-col bg-white dark:bg-[#1d2026]" 
      >
        <TranscriptToggle transcriptContent={VIDEO_TRANSCRIPT} />
        {/* Additional course/lecture details content */}
      </div>
    </div>
  );
};