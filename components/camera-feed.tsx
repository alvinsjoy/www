'use client';

import React, { useRef, useCallback, useState } from 'react';
import Webcam from 'react-webcam';
import { Card } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Camera } from 'lucide-react';

interface CameraFeedProps {
  onFrame: (imageData: string) => void;
  isProcessing: boolean;
}

export function CameraFeed({ onFrame, isProcessing }: CameraFeedProps) {
  const webcamRef = useRef<Webcam>(null);
  const [error, setError] = useState<string>('');

  const videoConstraints = {
    facingMode: 'environment',
    width: 640,
    height: 480,
  };

  const capture = useCallback(() => {
    if (!isProcessing && webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        const imageData = imageSrc.split(',')[1];
        onFrame(imageData);
      }
    }
  }, [onFrame, isProcessing]);

  React.useEffect(() => {
    const interval = setInterval(capture, 1000);
    return () => clearInterval(interval);
  }, [capture]);

  const handleUserMediaError = useCallback((error: string | DOMException) => {
    console.error('Camera error:', error);
    setError(
      "Camera access denied or device not available. Please ensure you've granted camera permissions.",
    );
  }, []);

  return (
    <div className="mx-auto w-full max-w-2xl">
      <Card className="relative overflow-hidden rounded-lg">
        {error ? (
          <Alert variant="destructive" className="m-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : (
          <>
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              videoConstraints={videoConstraints}
              onUserMediaError={handleUserMediaError}
              className="h-auto w-full"
              mirrored={false}
            />
            <div className="absolute bottom-4 right-4">
              <Camera className="h-6 w-6 text-white drop-shadow-lg" />
            </div>
          </>
        )}
      </Card>
    </div>
  );
}
