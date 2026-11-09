import React, { useState, useEffect } from 'react';
import { X, Play, Pause, Volume2, VolumeX, Maximize2, RotateCcw } from 'lucide-react';

export default function VideoPlayerModal({ video, onClose }) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(15);

  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            setIsPlaying(false);
            return 100;
          }
          return prev + 1;
        });
      }, 800);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  if (!video) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-purple-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl border border-[#e4ccf5] w-full max-w-3xl overflow-hidden animate-scaleUp flex flex-col">
        {/* Header */}
        <div className="bg-[#4d036a] text-white px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-xs bg-[#f4ba26] text-[#3e0454] px-2 py-0.5 rounded-full font-bold">
              Video Tutorial
            </span>
            <h3 className="font-bold text-sm tracking-wide text-white">
              {video.title} ({video.duration})
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Video Canvas Container */}
        <div className="relative bg-slate-900 aspect-video flex items-center justify-center overflow-hidden group">
          {/* Simulated video background */}
          <img
            src={video.thumbnail || '/assets/video_thumb_1.png'}
            alt={video.title}
            className={`w-full h-full object-cover filter brightness-90 transition-transform duration-700 ${isPlaying ? 'scale-105' : 'scale-100'}`}
          />

          {/* Video overlay with legal library branding */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />

          {/* Live animated player badge */}
          <div className="absolute top-4 left-4 flex items-center space-x-2 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-white text-xs">
            <span className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-red-500 animate-pulse' : 'bg-gray-400'}`} />
            <span className="font-semibold text-[11px]">
              {isPlaying ? 'Playing High-Definition Legal Tutorial' : 'Paused'}
            </span>
          </div>

          {/* Center Play/Pause button */}
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-16 h-16 rounded-full bg-[#7a0ea6]/90 hover:bg-[#9218c5] text-white flex items-center justify-center shadow-2xl transition-all transform hover:scale-110 border-2 border-white/80"
          >
            {isPlaying ? <Pause className="w-7 h-7 fill-white" /> : <Play className="w-7 h-7 fill-white ml-1" />}
          </button>

          {/* Video bottom control bar */}
          <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/95 to-transparent text-white space-y-2">
            {/* Scrubber */}
            <div
              className="w-full h-1.5 bg-white/30 rounded-full cursor-pointer relative overflow-hidden"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const pos = (e.clientX - rect.left) / rect.width;
                setProgress(Math.round(pos * 100));
              }}
            >
              <div
                className="h-full bg-[#f4ba26] rounded-full transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* Buttons */}
            <div className="flex items-center justify-between text-xs font-medium">
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="hover:text-yellow-400 transition-colors"
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => setProgress(0)}
                  className="hover:text-yellow-400 transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="hover:text-yellow-400 transition-colors"
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
                <span className="text-[11px] text-gray-300">
                  {Math.floor((progress / 100) * 5)}:{String(Math.floor(((progress / 100) * 320) % 60)).padStart(2, '0')} / {video.duration}
                </span>
              </div>

              <button
                onClick={() => alert('Full screen mode activated')}
                className="hover:text-yellow-400 transition-colors"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Video Description */}
        <div className="p-5 bg-white space-y-2">
          <h4 className="font-bold text-sm text-[#4c0469]">{video.title}</h4>
          <p className="text-xs text-gray-600 leading-relaxed">
            {video.description || 'Watch step-by-step practical demonstration on finding statutes, reviewing statutory amendments, configuring bookmarks, and extracting courtroom-ready citations on Tamil Raw Library.'}
          </p>
        </div>
      </div>
    </div>
  );
}
