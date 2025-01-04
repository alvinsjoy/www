'use client';

import { useState, useCallback } from 'react';
import { CameraFeed } from '@/components/camera-feed';
import { DetectionOverlay } from '@/components/detection-overlay';
import ThemeSwitch from '@/components/theme-switch';
import type { DetectionResult } from '@/types/detection';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { LuCircleAlert } from 'react-icons/lu';

export default function Home() {
  const [detections, setDetections] = useState<DetectionResult[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [processingTime, setProcessingTime] = useState<number>(0);

  const processFrame = useCallback(async (formData: FormData) => {
    try {
      setIsProcessing(true);
      setError(null);

      const response = await fetch('localhost:8000/detect', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Detection failed');
      }

      const data = await response.json();
      setDetections(data.results);
      setProcessingTime(data.processing_time);
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
        <h1 className="text-center text-3xl font-bold text-foreground">
          Traffic Sign Detection
        </h1>
        <div className="absolute right-0 top-0">
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
