'use client';

import { Button } from '@/components/ui/button';
import { useAudioPref } from '@/hooks/use-audio-pref';
import { FaVolumeHigh, FaVolumeXmark } from 'react-icons/fa6';

export default function AudioToggle() {
  const [isEnabled, setAudioPreference] = useAudioPref();

  return (
    <Button
      variant="ghost"
      size="icon"
      className="text-muted-foreground hover:text-foreground rounded-full"
      onClick={() => setAudioPreference(!isEnabled)}
    >
      {isEnabled ? <FaVolumeHigh /> : <FaVolumeXmark />}
      <span className="sr-only">Toggle audio feedback</span>
    </Button>
  );
}
