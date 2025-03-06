'use client';

import { useState, useCallback, useRef } from 'react';
import { useAudioPref } from '@/hooks/use-audio-pref';
import { CameraFeed } from '@/components/camera-feed';
import { DetectionOverlay } from '@/components/detection-overlay';
import ThemeSwitch from '@/components/theme-switch';
import AudioToggle from '@/components/audio-toggle';
import type { DetectionResult } from '@/types/detection';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { LuCircleAlert } from 'react-icons/lu';
import { motion } from 'motion/react';
import { detectTrafficSigns } from '@/lib/actions/detect';

function areDetectionsEqual(
  prev: DetectionResult[],
  curr: DetectionResult[] | undefined,
): boolean {
  if (!prev || !curr) return prev === curr;
  if (prev.length !== curr.length) return false;
  if (prev.length === 0) return true;

  const sortedPrev = [...prev].sort((a, b) => a.class_id - b.class_id);
  const sortedCurr = [...curr].sort((a, b) => a.class_id - b.class_id);

  return sortedPrev.every((detection, index) => {
    const currDetection = sortedCurr[index];
    return detection.class_id === currDetection.class_id;
  });
}

export default function Home() {
  const [detections, setDetections] = useState<DetectionResult[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [processingTime, setProcessingTime] = useState<number>(0);
  const previousDetections = useRef<DetectionResult[]>([]);
  const [audioEnabled] = useAudioPref();

  const processFrame = useCallback(async (formData: FormData) => {
    try {
      setIsProcessing(true);
      setError(null);

      const result = await detectTrafficSigns(formData);
      if (!result.success) {
        throw new Error(result.error);
      }
      const data = result.data;

      setProcessingTime(data.processing_time || 0);
      // Only update if the detections are different
      if (!areDetectionsEqual(previousDetections.current, data.results)) {
        setDetections(data.results);
        previousDetections.current = data.results;
      }
    } catch (err) {
      setError('Failed to process image. Please try again.');
      console.error('Detection error:', err);
    } finally {
      setIsProcessing(false);
    }
  }, []);

  return (
    <main className="container mx-auto flex min-h-screen flex-col items-center px-3 py-4 md:px-4 md:py-8">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="relative mb-6 w-full md:mb-8"
      >
        <h1 className="text-center text-3xl font-bold tracking-tight md:text-4xl">
          <span className="from-primary to-accent-foreground bg-gradient-to-r bg-clip-text text-transparent">
            Traffic Sign Recognition
          </span>
        </h1>
        <div className="absolute top-1 flex w-full justify-between md:top-0">
          <ThemeSwitch />
          <AudioToggle />
        </div>
      </motion.div>

      {error && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="w-full max-w-2xl"
        >
          <Alert variant="destructive" className="mx-auto mb-4 md:mb-6">
            <LuCircleAlert className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
        className="w-full max-w-4xl"
      >
        <CameraFeed onFrame={processFrame} isProcessing={isProcessing} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
        className="w-full max-w-4xl"
      >
        <DetectionOverlay
          detections={detections}
          processingTime={processingTime}
          audioEnabled={audioEnabled}
        />
      </motion.div>
    </main>
  );
}
