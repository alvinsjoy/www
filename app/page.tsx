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

function areDetectionsEqual(
  prev: DetectionResult[],
  curr: DetectionResult[],
): boolean {
  if (prev.length !== curr.length) return false;

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
      const response = await fetch('/api/detect', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Detection failed');
      }

      const data = await response.json();

      // Only update if the detections are different
      if (!areDetectionsEqual(previousDetections.current, data.results)) {
        setDetections(data.results);
        setProcessingTime(data.processing_time);
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
    <main className="container mx-auto flex min-h-screen flex-col items-center px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="relative mb-8 w-full"
      >
        <h1 className="text-center text-4xl font-bold tracking-tight">
          <span className="from-primary to-accent-foreground bg-gradient-to-r bg-clip-text text-transparent">
            Traffic Sign Recognition
          </span>
        </h1>
        <div className="absolute top-0 flex w-full justify-between">
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
          <Alert variant="destructive" className="mx-auto mb-6">
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
