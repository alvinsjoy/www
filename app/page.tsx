'use client';

import { useState, useCallback, useRef } from 'react';
import { CameraFeed } from '@/components/camera-feed';
import { DetectionOverlay } from '@/components/detection-overlay';
import ThemeSwitch from '@/components/theme-switch';
import type { DetectionResult } from '@/types/detection';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { LuCircleAlert } from 'react-icons/lu';

function areDetectionsEqual(
  prev: DetectionResult[],
  curr: DetectionResult[],
): boolean {
  if (prev.length !== curr.length) return false;

  const sortedPrev = [...prev].sort((a, b) => a.class_id - b.class_id);
  const sortedCurr = [...curr].sort((a, b) => a.class_id - b.class_id);

  return sortedPrev.every((detection, index) => {
    const currDetection = sortedCurr[index];
    return (
      detection.class_id === currDetection.class_id &&
      Math.abs(detection.confidence - currDetection.confidence) < 0.1
    );
  });
}

export default function Home() {
  const [detections, setDetections] = useState<DetectionResult[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [processingTime, setProcessingTime] = useState<number>(0);
  const previousDetections = useRef<DetectionResult[]>([]);

  const processFrame = useCallback(async (formData: FormData) => {
    try {
      setIsProcessing(true);
      setError(null);

      const response = await fetch('http://localhost:8000/detect', {
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
    <main className="container mx-auto items-center px-4 py-8">
      <div className="relative mb-8">
        <h1 className="text-foreground text-center text-3xl font-bold">
          Traffic Sign Detection
        </h1>
        <div className="absolute top-0 right-0">
          <ThemeSwitch />
        </div>
      </div>

      {error && (
        <Alert variant="destructive" className="mx-auto mb-4 max-w-2xl">
          <LuCircleAlert className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <CameraFeed onFrame={processFrame} isProcessing={isProcessing} />
      <DetectionOverlay
        detections={detections}
        processingTime={processingTime}
      />
    </main>
  );
}
