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
      className="text-muted-foreground hover:text-foreground h-8 w-8 rounded-full md:h-10 md:w-10"
      onClick={() => setAudioPreference(!isEnabled)}
    >
      {isEnabled ? (
        <FaVolumeHigh className="h-4 w-4 md:h-5 md:w-5" />
      ) : (
        <FaVolumeXmark className="h-4 w-4 md:h-5 md:w-5" />
      )}
      <span className="sr-only">Toggle audio feedback</span>
    </Button>
  );
}
