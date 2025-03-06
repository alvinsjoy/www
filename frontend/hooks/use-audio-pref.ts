'use client';

import { useState, useEffect } from 'react';

export function useAudioPref(): [boolean, (value: boolean) => void] {
  const [isEnabled, setIsEnabled] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('audioFeedback');
    setIsEnabled(stored === 'true');
  }, []);

  const setAudioPreference = (value: boolean) => {
    localStorage.setItem('audioFeedback', String(value));
    setIsEnabled(value);
  };

  return [isEnabled, setAudioPreference];
}
