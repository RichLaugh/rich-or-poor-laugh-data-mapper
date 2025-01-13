import {useEffect, useRef, useState} from 'react';

export function useAudioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const reload = () => {
      setCurrentTime(0);
      setIsPlaying(false);
      togglePlay();
  }

  useEffect(()=>{
    if (currentTime === duration) {
      reload();
    }
  },[currentTime])

  const seek = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  return {
    audioRef,
    isPlaying,
    currentTime,
    duration,
    togglePlay,
    seek,
    reload,
    handleTimeUpdate,
    handleLoadedMetadata,
  };
}