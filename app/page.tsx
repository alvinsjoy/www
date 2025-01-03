'use client';

import { useState, useCallback } from 'react';
import { CameraFeed } from '@/components/camera-feed';
import { DetectionOverlay } from '@/components/detection-overlay';
import type { DetectionResult } from '@/types/detection';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

export default function Home() {
  const [detections, setDetections] = useState<DetectionResult[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [processingTime, setProcessingTime] = useState<number>(0);

  const processFrame = useCallback(async (imageData: string) => {
    try {
      setIsProcessing(true);
      setError(null);

      const response = await fetch('localhost:8000/detect', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image: imageData }),
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
    <main className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-center text-3xl font-bold">
        Traffic Sign Detection
      </h1>

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
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
